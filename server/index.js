const express = require("express");
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const generateCards = require('./utils/generateCards');
const { saveProgress, getFile } = require('./utils/saveProgress');
const validateCards = require('./utils/validateCards');
const CONFIGS = require("./configs/configs");
const staticValues = require("./configs/staticValues");
const calculateElapsedTime = require("./utils/calculateElapsedTime");
const removeValidatedCards = require('./utils/removeValidatedCards');

const server = express();
const httpServer = http.createServer(server);

// creating /game-boards directory if doesn't exist for use
const gbDir = './game-boards';
if (!fs.existsSync(gbDir)){
    fs.mkdirSync(gbDir);
}

// status check endpoint
server.use("/status", (req, res, next) => {
    res.send('<h1>Memory Game server is Up and Running *_* </h1>');
});

// statif file serving for serving images
server.get('/img/*', (req, res) => {
    const imgName = req.url.slice(5);
    res.sendFile(__dirname + '/public/assets/' + imgName);
});

// setting CORS headers
server.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );
    res.setHeader(
        "Access-control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

// initializing websocket server instance
const wsInstance = new WebSocket.Server({ server: httpServer, path: '/memory-game' });

// maintaining clients connections on this object
const wsClients = {};

// maintain cards shared with clients
const cardsSets = {};

// websocket listening for connections
wsInstance.on('connection', function connection(ws) {
    // init game
    // generate unique file_id with uuid library version 4 (random).
    const FILE_ID = uuidv4();
    console.log(`a client is connected`, FILE_ID);

    // save the client connection in state.
    wsClients[FILE_ID] = ws;

    // send session id to client for using in future communications
    wsClients[FILE_ID].send(JSON.stringify({
        type: staticValues.MSG_TYPE_INIT_USER,
        sessionId: FILE_ID,
    }));

    wsClients[FILE_ID].on('message', function incoming(msg) {
        // recieved messages.
        const { type, data, sessionId } = JSON.parse(msg);
        // console.log(` > type, > data, > sessionId +>>`, type, data, sessionId)

        let msgPayload = {};
        switch (type) {
            case staticValues.MSG_TYPE_INIT_GAME:
                const { difficulty } = data;
                // create file to save progress
                saveProgress({
                    fileId: FILE_ID,
                    difficulty: difficulty,
                });

                // generate cards
                const { cardsData, cardsDataForClient } = generateCards(difficulty);

                // maintain state for cards validation with game rounds
                cardsSets[FILE_ID] = cardsData;

                msgPayload = {
                    type: staticValues.MSG_TYPE_INIT_GAME,
                    data: {
                        cards: cardsDataForClient,
                    }
                }
                break;
            // when first card is picked game starts
            case staticValues.MSG_TYPE_START_GAME:
                // start the game
                saveProgress({
                    fileId: FILE_ID,
                    startTime: +new Date(),
                });
                msgPayload = {
                    type: staticValues.MSG_TYPE_START_GAME,
                    data: {
                        status: 'success'
                    },
                };

                break;
            case staticValues.MSG_TYPE_GAME_ROUND:
                const { gameRound, selectedCards } = data;
                const cs = cardsSets[FILE_ID];
                const cardValidation = validateCards(cs, selectedCards);

                if (cardValidation) {
                    const updatedCS = removeValidatedCards(cs, selectedCards);
                    cardsSets[FILE_ID] = [
                        ...updatedCS
                    ];
                }

                const round = gameRound + 1;
                const gameComplete = cardsSets[FILE_ID].length === 0;

                const { errorScore } = saveProgress({
                    fileId: FILE_ID,
                    gameRound: round,
                    cardsValidation: cardValidation,
                    selectedCards: selectedCards,
                });
                // send msg
                msgPayload = {
                    type: staticValues.MSG_TYPE_GAME_ROUND,
                    data: {
                        validation: cardValidation === true ? 'success' : 'fail',
                        gameRound: round,
                        errorScore: errorScore,
                        gameCompleted: gameComplete
                    },
                }
                break;
            case staticValues.MSG_TYPE_GAME_COMPLETE:
                saveProgress({
                    fileId: FILE_ID,
                    endTime: +new Date(),
                });
                const fileData = getFile(FILE_ID);
                const elapsedTimeInMinutes = calculateElapsedTime(fileData.startTime, fileData.endTime);

                msgPayload = {
                    type: staticValues.MSG_TYPE_GAME_COMPLETE,
                    data: {
                        elapsedTime: elapsedTimeInMinutes,
                        errorScore: fileData.errScore,
                    }
                }
                break;
            default: break;
        }

        // generic send method
        wsClients[FILE_ID].send(JSON.stringify({
            ...msgPayload,
            sessionId: FILE_ID,
        }));
    });

    // on connection close / disconnecting do the cleaning process
    // remove client from clients obj
    wsClients[FILE_ID].on('close', function () {
        delete wsClients[FILE_ID];
        console.log('XXXX client disconnected : ---', FILE_ID, '--- XXXX');
    });
});

// global error handler
server.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// listen to requests 
httpServer.listen(CONFIGS.PORT, () => console.log(`listening on port :: >> ${CONFIGS.PORT}`));

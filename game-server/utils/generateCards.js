const { v4: uuidv4 } = require('uuid');
const CONFIGS = require("../configs/configs");
const STATIC_VALUES = require("../configs/staticValues");
const shuffleArray = require('./shuffleArray');
const imgageUrls = require('../configs/imgUrls');

module.exports = (difficulty) => {

    // difficulty setting value
    let difficultySetting = 0;
    // coolImages return a random array of `image urls` as per the difficulty setting 
    switch (difficulty) {
        case STATIC_VALUES.DIFFICULTY_EASY:
            difficultySetting = CONFIGS.DIFFICULTY_SETTING_EASY;
            break;
        case STATIC_VALUES.DIFFICULTY_MEDIUM:
            difficultySetting = CONFIGS.DIFFICULTY_SETTING_MEDIUM;
            break;
        case STATIC_VALUES.DIFFICULTY_HARD:
            difficultySetting = CONFIGS.DIFFICULTY_SETTING_HARD;
            break;
        default:
            break;
    };

    const imgs = shuffleArray([
        ...imgageUrls
    ]);
    // array to hold cards generated
    // to keep reference in server
    const cardsData = [];

    // number of cards to generate
    // a set of cards ===  DIFFICULTY_SETTING * 2
    const cardsCount = difficultySetting * 2;

    for (let i = 0; i < cardsCount; i++) {
        let imgId = 0;
        // for looping through the images twice
        if (i < difficultySetting) {
            imgId = i;
        } else {
            imgId = i - difficultySetting;
        }
        const cardData = {
            id: `imgid_${imgId}`,
            uuid: uuidv4(),
            imgUrl: imgs[imgId],
        };
        cardsData.push(cardData);
    }

    // shuffle the generated cards to return to client
    const shuffledCards = shuffleArray([
        ...cardsData
    ]);

    // this is for sending to client
    // only uuid and imgUrl is sent to client
    const cardsDataForClient = shuffledCards.map((item) => {
        return {
            id: item.uuid,
            imgUrl: item.imgUrl
        };
    });

    return { cardsData, cardsDataForClient };
};
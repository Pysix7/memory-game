import React, { Fragment, PureComponent } from 'react';
import Head from 'next/head';
import { Card, Typography } from 'antd'
import staticValues from '../configs/staticValues';
import configs from '../configs/configs';
import SelectDifficulty from '../components/SelectDifficulty';
import GameBoard from '../components/GameBoard';
import removeValidatedCards from '../utils/removeValidatedCards';
import ResultBoard from '../components/ResultBoard';

const { Title } = Typography;

class MemoryGame extends PureComponent {
  state = {
    gameStarted: false,
    sessionId: null,
    firstClick: false,
    cardsData: [],
    startLocalTimer: false,
    errorScore: 0,
    selectedCards: [],
    gameRound: 0,
    gameCompleted: false,
    elapsedTime: null,
  }

  // websocket client instance
  wsClient = null;

  componentDidMount() {
    this.wsClient = new WebSocket(configs.SERVER_WS_URI);
    this.listenToMessages();
    this.wsClient.onopen = () => {
      console.log(`websocket connection opened`)
    }
    this.wsClient.onclose = (e) => {
      console.log(`ws connection closed`, e)
    }
  }

  listenToMessages = () => {
    // listening to message events
    this.wsClient.onmessage = (message) => {
      const msgData = JSON.parse(message.data);

      if (msgData && msgData.type) {
        switch (msgData.type) {
          case staticValues.MSG_TYPE_INIT_USER:
            this.setState({
              sessionId: msgData.sessionId
            })
            break;
          case staticValues.MSG_TYPE_INIT_GAME: {
            this.setState({
              cardsData: [
                ...msgData.data.cards
              ]
            });
            break;
          };
          case staticValues.MSG_TYPE_START_GAME: {
            if (msgData.data.status === 'success') {
              console.log(`game started`)
              this.setState({
                firstClick: true,
                gameStarted: true,
                startLocalTimer: true,
              });
            }
            break;
          }
          case staticValues.MSG_TYPE_GAME_ROUND: {
            const roundValidation = msgData.data.validation === 'success';
            if (roundValidation) {
              this.setState((prevState) => {
                const updatedCD = removeValidatedCards(
                  prevState.cardsData,
                  prevState.selectedCards
                );
                return {
                  cardsData: updatedCD,
                  gameRound: msgData.data.gameRound,
                  errorScore: msgData.data.errorScore,
                  selectedCards: [],
                }
              });

              // if game is completed fetch game results;
              if (msgData.data.gameCompleted) {
                this.sendMessage({
                  type: staticValues.MSG_TYPE_GAME_COMPLETE
                });
              }
            } else {
              this.setState({
                gameRound: msgData.data.gameRound,
                errorScore: msgData.data.errorScore,
                selectedCards: [],
              });
            }
            break;
          }
          case staticValues.MSG_TYPE_GAME_COMPLETE: {
            this.setState({
              gameCompleted: true,
              elapsedTime: msgData.data.elapsedTime,
              // errorScore: msgData.errorScore,
            });
            break;
          }
          default: break;
        }
      }
    }
  }

  // generic send message function
  // sends message with session_id
  sendMessage = (message) => {
    // data format to be sent
    /* {
      type: 'init-game',
      data: {
        difficulty: "easy"
      }
      sessionId: 'asasds'
    } */
    const { sessionId } = this.state;

    if (this.wsClient) {
      this.wsClient.send(JSON.stringify({
        ...message,
        data: {
          ...message.data
        },
        sessionId,
      }));
    }
  }

  // after selecting difficulty request cards
  onDifficultySelect = (difficulty) => {
    this.sendMessage({
      type: staticValues.MSG_TYPE_INIT_GAME,
      data: {
        difficulty
      }
    });
  }

  onCardClick = (cardId) => {
    const { firstClick, gameRound } = this.state;
    if (firstClick === false) {
      // when the card is first clicked start the game.
      this.sendMessage({
        type: staticValues.MSG_TYPE_START_GAME,
        data: {},
      });
      this.setState({
        selectedCards: [cardId]
      })
    } else {
      this.setState((prevState) => {
        let selCardArray = [];
        if (prevState.selectedCards.length > 0) {
          selCardArray = [...prevState.selectedCards, cardId]

          // delayed so that the image is rendered to user before checking for validation 
          setTimeout(() => {
            this.sendMessage({
              type: staticValues.MSG_TYPE_GAME_ROUND,
              data: {
                gameRound,
                selectedCards: selCardArray,
                errorScore: prevState.errorScore,
              }
            });
          }, 1000);

        } else {
          selCardArray.push(cardId)
        }

        return {
          selectedCards: selCardArray
        };
      });
    }
  }

  render() {
    const {
      startLocalTimer,
      errorScore,
      cardsData,
      selectedCards,
      gameCompleted,
      elapsedTime,
    } = this.state;

    return (
      <Fragment>
        <Head>
          <title>Memory Game</title>
        </Head>
        <Card className="pageContainer" >
          <Title level={1} className="gameTitle" >Memory game</Title>
          {(() => {
            let comp = null;
            if (gameCompleted) {
              comp = (
                <ResultBoard
                  errorScore={errorScore}
                  elapsedTime={elapsedTime}
                />
              )
              // if cardsData is present then display the cards
            } else if (cardsData && cardsData.length > 0) {
              comp = (
                <GameBoard
                  cardsData={cardsData}
                  startTimer={startLocalTimer}
                  errorScore={errorScore}
                  onCardClick={this.onCardClick}
                  selectedCards={selectedCards}
                />
              );
            } else {
              // display difficulty select component
              comp = (
                <SelectDifficulty
                  onDifficultySelect={this.onDifficultySelect}
                />
              )
            }

            return comp;
          })()}
        </Card>
      </Fragment>
    )
  }
}

export default MemoryGame;
export default {
    SERVER_URI: process.env.SERVER_URI || 'http://localhost:3333',
    SERVER_WS_URI: process.env.SERVER_WS_URI || 'ws://192.168.132.49:3333/memory-game',
    DIFFICULTY_SETTING_EASY: 5,
    DIFFICULTY_SETTING_MEDIUM: 10,
    DIFFICULTY_SETTING_HARD: 25,
    CARD_OPEN_TIME: 3, // show card for 3 seconds
};

module.exports = {
  PORT: process.env.PORT || 3333,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/memorygame',
  DIFFICULTY_SETTING_EASY: 5,
  DIFFICULTY_SETTING_MEDIUM: 10,
  DIFFICULTY_SETTING_HARD: 25,
};

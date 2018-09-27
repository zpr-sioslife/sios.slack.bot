const Slackbots = require('./slackbots');

const TOKEN = process.env.TOKEN;
const BOT_NAME = process.env.BOT_NAME;

const bot = new Slackbots({
    token: TOKEN,
    name: BOT_NAME
});

bot.on('error', console.error);
bot.on('start', () => console.log('> bot started'));

module.exports = bot;
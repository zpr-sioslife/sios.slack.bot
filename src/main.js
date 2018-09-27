const { bot } = require('./core');
const LimitPosts = require('./scripts/limit-posts');
const BestReactionPost = require('./scripts/best-reaction-post');
const PingSioslife = require('./scripts/ping-sioslife');

// .env
const CHANNEL_NAME = process.env.CHANNEL;

const main = async () => {
  // {id, name, ..}
  const channel = await bot.getChannel(CHANNEL_NAME).catch(console.error);

  // Bootstrap Bot Scripts
  // new LimitPosts(channel);
  // new BestReactionPost(channel);
  new PingSioslife(channel);
}

module.exports = main;
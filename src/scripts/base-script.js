const { bot, storage } = require('../core');

class BaseScript {

    constructor(channel) {
        this.channel = channel;
        this.messageParams = { icon_emoji: ':sioslife:' };
        this.bot = bot;

        this.start();
    }

    start() {
        bot.on('message', data => {
            if (this.isMessageValid(data))
                this.onValidMessage(data);
        });
    }

    onValidMessage(data) { /*to be overridden */ }

    isMessageValid(data) {
        return (
            data.type === 'message' &&
            data.username !== bot.name &&
            data.subtype === undefined &&
            data.channel === this.channel.id
        )
    }

    saveUserData(user, data) {
        return storage.SetValue(user, data);
    }

    getUserData(user) {
        return storage.GetValue(user);
    }

    async postMessage(text, otherChannelName = null) {
        if(otherChannelName) {
            const newChannel = await bot.getChannel(otherChannelName).catch(console.error);
            return await bot.postMessage(newChannel.name, text, this.messageParams);
        }
        else 
            return await bot.postMessage(this.channel.name, text, this.messageParams);
    }

    deleteMessage(ts) {
        return bot.deleteMessage(this.channel.id, ts).fail(console.log);
    }

    async getChannelHistory(params) {
        return await bot.getChannelsHistory(this.channel.id, params).catch(console.error);
    }
}

module.exports = BaseScript;
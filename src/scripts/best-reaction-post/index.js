const BaseScript = require('../base-script.js');
const reaction2number = require('../_helpers/reaction2number.js');

const COMMAND_TEXT = '!best';

class BestReactionPost extends BaseScript {

    constructor(channel) {
        super(channel);
    }

    async onValidMessage(data) {
        if (data.text !== COMMAND_TEXT)
            return;

        await this.doCheck();
    }

    async doCheck() {
        const LastBestReactionPost = this.getUserData('best-reaction-post');
        const oldestDay = LastBestReactionPost ? parseInt(new Date(LastBestReactionPost).getTime() / 1000).toFixed(0) : 0;
        const channelHistory = await this.getChannelHistory({oldest: oldestDay, inclusive: 1});
        const channelMessages = channelHistory.messages;

        let messages = this.processMessages(channelMessages);
        messages = this.orderMessagesByHigherPoints(messages);

        const output = this.outputResult(messages);
        this.postMessage(output);

        const today = new Date();
        const formatTime = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`; 
        this.saveUserData('best-reaction-post', formatTime);
    }

    // returns [{ title: '', url: '', user: '', reactions: [6,6,4] }, points: null, ..]
    processMessages(channelMessages) {
        channelMessages = channelMessages.map(message => {
            const user = message.user;
            const attachments = message.attachments;
            const reactions = message.reactions ? message.reactions : [];
            const text = attachments === undefined ? message.text : attachments[0].title;
            const url = attachments === undefined ? message.text : attachments[0].title_link;

            // the output for each msg
            const msg = { title: text, url: url, user: user, reactions: [], points: null };

            msg.reactions = reactions.map(reaction => {
                const name = reaction.name;
                const count = reaction.count;
                const reacts = [];

                for (let index = 0; index < count; index++) {
                    reacts.push(reaction2number(name));
                }
                return reacts;
            });

            //flat
            msg.reactions = msg.reactions.reduce((a, b) => a.concat(b), []);

            return msg;
        });

        // filter out bot messages
        channelMessages = channelMessages.filter(message => message.user !== this.bot.id);

        return channelMessages;
    }

    orderMessagesByHigherPoints(messages) {
        messages.forEach(message => message.points = this.calcReactionPoints(message.reactions));

        return messages.sort((a, b) => b.points - a.points);
    }

    calcReactionPoints(reactions) {
        const total = reactions.reduce((accumulator, reaction) => {
            return accumulator + Math.pow(reaction, 2);
        }, 0);

        return Math.sqrt(total);
    }

    outputResult(messages) {
        let output = '';

        messages.forEach(message => {
            output += `> *Title:* ${message.title}\n`;
            output += `> *Url:* ${message.url}\n`;
            output += `> *Points:* ${message.points} [${message.reactions}]\n`;
            output += "#############################################################\n";
        });

        return output;
    }
}

module.exports = BestReactionPost;
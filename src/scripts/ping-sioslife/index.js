const BaseScript = require('../base-script.js');
const got = require('got');

const codes = [
    // 100,101,102,
    200, 201, 202, 203, 204, 205, 206,
    300, 301, 302, 303, 304, 305, 306, 307, 308,
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 414, 415, 416, 416, 422, 428, 429, 431, 451,
    500, 501, 502, 503, 504, 505, 511, 520, 522, 524
]

class PingSioslife extends BaseScript {
    constructor(channel) {
        super(channel);

        this.numTries = 3;
        this.counter = this.getUserData('ping-sioslife-counter');
        this.counter = this.counter ? this.counter : 1;
        this.isOkay = true;
        this.isOkayWarned = false;
        this.url = 'https://login.sioslife.com';
        this.LastMessageTs = this.getUserData('ping-sioslife-last-msg');
        this.users = process.env.SLACK_USERS;

        this.init();
    }

    start() { /* override start() to not start bot.on('message',..) */ }

    init() {
        this.deletePreviousMessage();
        setTimeout(() => this.watch(), 5000);
    }

    async watch() {
        console.log(`\n>> BEGIN Pinging ${this.url}`);
        let statusCode = undefined;
        let statusMessage = undefined;

        for (let i = 1; i <= this.numTries; i++) {
            const res = await this.ping(this.url);
            statusCode = res.statusCode;
            statusMessage = res.statusMessage ? res.statusMessage : res;

            this.isOkay = ((statusCode >= 400 || statusCode < 200) || statusCode === undefined) ? false : true;

            console.log(`try number: ${i}`);
            console.log(`statsCode: ${statusCode}`);
            console.log(`isOkay: ${this.isOkay}`);
            i != this.numTries && console.log('');
        }

        if (!this.isOkay && !this.isOkayWarned) {
            this.isOkayWarned = true;
            await this.sendErrorMsg(statusCode, statusMessage);
        }

        if (this.isOkay && this.isOkayWarned) {
            this.isOkayWarned = false;
            this.deletePreviousMessage();
            await this.sendOkayMsg(statusCode, statusMessage);
        }

        console.log(`## FINISH Pinging ${this.url}`);

        // testing
        // const codeId = Math.floor(Math.random() * codes.length);
        // this.url = 'https://httpstat.us/' + codes[codeId];

        setTimeout(() => this.watch(), 300000); // 300000 = 5min cycle
    }

    ping(url) {
        return got(url, { timeout: 20000 }).catch(err => err);
    }

    async sendErrorMsg(statusCode, statusMessage) {
        const msg = `${this.users}\n[#${this.counter}] :sad_pepe: Depois de ${this.numTries} tentativas eu não consegui aceder ao ${this.url} :fire_engine:.\n\`\`\`statusCode: ${statusCode}\nstatusMessage: ${statusMessage}\`\`\``;
        await this.sendMsg(msg);
    }

    async sendOkayMsg(statusCode, statusMessage) {
        const msg = `[#${this.counter}] :wave: Parece que o ${this.url} está de volta :smile:.\n\`\`\`statusCode: ${statusCode}\nstatusMessage: ${statusMessage}\`\`\``;
        await this.sendMsg(msg);
        this.counter++;
        this.saveUserData('ping-sioslife-counter', this.counter);
    }

    async sendMsg(msg) {
        console.log(msg);

        this.deletePreviousMessage();
        const res = await this.postMessage(msg);

        // post message in other channel for log-history purpose
        await this.postMessage(msg, process.env.PING_CHANNEL);

        if (res.ok) {
            this.LastMessageTs = res.ts;
            this.saveUserData('ping-sioslife-last-msg', res.ts);
        }

        return res;
    }

    deletePreviousMessage() {
        if (this.LastMessageTs)
            this.deleteMessage(this.LastMessageTs);

        this.LastMessageTs = null;
    }

    onValidMessage(data) {
        const userId = data.user;
        const msg = data.text;

        console.log(`userId: ${userId}`);
        console.log(msg);
        console.log('');
    }
}

module.exports = PingSioslife;
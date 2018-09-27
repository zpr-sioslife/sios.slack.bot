const BaseScript = require('../base-script.js');

class LimitPosts extends BaseScript {

    constructor(channel) {
        super(channel);
    }

    onValidMessage(data) {
        const userId = data.user;
        const msg = data.text;
        const today = new Date().getDay() + ''; // convert to string
        const userPostDay = this.getUserData(userId) + ''; // convert to string

        console.log(`userPostDay:${userPostDay} | today:${today}`);
        console.log(`userId: ${userId}`);
        console.log(msg);
        console.log('**********************\n');

        if (userPostDay === today) {
            this.deleteMessage(data.ts);
        }
        else {
            this.saveUserData(userId, today);
        }
    }
}

module.exports = LimitPosts;
const Slackbots = require('slackbots');

// HACK. EXTEND THE SLACKBOT API 
/**
  * Deletes a message
  * @param {string} id - channel ID
  * @param {string} ts - timestamp
  * @param {object} params
  * @returns {vow.Promise}
  */
 Slackbots.prototype.deleteMessage = function (id, ts, params) {
	params = Object.assign({ ts: ts, channel: id }, params, {});

	return this._api('chat.delete', params);
}

/**
  * https://api.slack.com/methods/channels.history
  * Fetches history of messages and events from a channel.
  * @param {string} id - channel ID
  * @param {object} params
  * @returns {vow.Promise}
  */
 Slackbots.prototype.getChannelsHistory = function (id, params) {
	params = Object.assign({ channel: id }, params, {});

	return this._api('channels.history', params);
}

module.exports = Slackbots;
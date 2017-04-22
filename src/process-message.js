const publishMessage = require('./publish-message');

function processMessage(event) {
  const supportedEventTypes = [
    'message',
    'message.channels',
  ];

  if (supportedEventTypes.indexOf(event.type) === -1) {
    return Promise.reject(`Unsupported event type: ${event.type}`);
  }

  // Don't respond to bots. Ignore messages that don't begin with bot name.
  const nameMatch = new RegExp(`^@?${process.env.SLACK_MACHINE_USER_NAME} `, 'i');
  if (event.bot_id || !nameMatch.test(event.text)) {
    return Promise.resolve('OK: ignored message: not for me');
  }

  return publishMessage(event);
}

module.exports = processMessage;

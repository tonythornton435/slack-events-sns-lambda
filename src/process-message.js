const publishMessage = require('./publish-message');

function processMessage(event) {
  const supportedEventTypes = [
    'message',
    'message.channels',
  ];

  const supportedBotVerbs = [
    'ping',
  ];

  // Event subscriptions are managed in the Slack App settings.
  if (supportedEventTypes.indexOf(event.type) === -1) {
    return Promise.reject(`Unsupported event type: ${event.type}`);
  }

  // Don't respond to bots. Ignore messages that don't begin with our bot name.
  const nameMatch = new RegExp(`^@?${process.env.SLACK_MACHINE_USER_NAME} `, 'i');
  if (event.bot_id || !nameMatch.test(event.text)) {
    return Promise.resolve('OK: ignored message: not for me');
  }

  // Extract command.
  const commandWords = event.text.replace(nameMatch, '').split(/\s+/);
  const command = {
    predicate: commandWords.splice(1).join(' '),
    subject: process.env.SLACK_MACHINE_USER_NAME,
    verb: commandWords[0],
  };

  if (supportedBotVerbs.indexOf(command.verb) === -1) {
    return Promise.resolve('OK: ignored message: unsupported verb');
  }

  // Compute expected SNS topic ARN. This is simply a convention; creating the
  // ARN is outside the scope of this code.
  const topicArn = `${process.env.AWS_SNS_TOPIC_ARN_PREFIX}${command.verb}`;

  // Add command words to the event to form SNS message.
  const snsMessage = Object.assign(event, { command });

  return publishMessage(snsMessage, topicArn);
}

module.exports = processMessage;

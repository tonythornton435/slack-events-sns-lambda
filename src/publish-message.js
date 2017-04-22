const aws = require('aws-sdk');

aws.config.region = process.env.AWS_REGION;
const sns = new aws.SNS();
const snsTopicPrefix = `${process.env.AWS_SNS_TOPIC_PREFIX}-${process.env.SLACK_MACHINE_USER_NAME}`;

function findTopicArn(topics, topicName) {
  const topicArnMatch = new RegExp(`:${topicName}$`);
  const topicArn = topics.find(topic => topicArnMatch.test(topic.TopicArn));

  return topicArn ? topicArn.TopicArn : null;
}

function getTopicArns() {
  return new Promise((resolve, reject) => {
    sns.listTopics({}, (error, data) => {
      if (error) {
        return reject(`Could not retrieve SNS topics: ${error.message}`);
      }

      return resolve(data.Topics);
    });
  });
}

function postMessage(topicArn, snsMessage) {
  if (!topicArn) {
    return `OK: ignored message: ${topicArn} does not exist`;
  }

  const payload = {
    Message: JSON.stringify(snsMessage),
    TopicArn: topicArn,
  };

  return new Promise((resolve, reject) => {
    sns.publish(payload, (error, data) => {
      if (error) {
        return reject(`Could not post to ${topicArn}: ${error.message}`);
      }

      return resolve(`OK: sent SNS message ${data.MessageId}`);
    });
  });
}

function publishMessage(event) {
  const nameMatch = new RegExp(`^@?${process.env.SLACK_MACHINE_USER_NAME} `, 'i');
  const commandWords = event.text.replace(nameMatch, '').split(/\s+/);

  const command = {
    predicate: commandWords.splice(1).join(' '),
    subject: process.env.SLACK_MACHINE_USER_NAME,
    verb: commandWords[0],
  };

  // Set SNS topic name.
  const topicName = `${snsTopicPrefix}-${command.verb}`;

  // Add command words to message.
  const snsMessage = Object.assign(event, { command });

  return getTopicArns()
    .then(topics => findTopicArn(topics, topicName))
    .then(topicArn => postMessage(topicArn, snsMessage));
}

module.exports = publishMessage;

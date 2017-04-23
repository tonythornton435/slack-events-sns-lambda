const aws = require('aws-sdk');

function publishMessage(snsMessage, topicArn) {
  const sns = new aws.SNS();
  const payload = {
    Message: JSON.stringify(snsMessage),
    TopicArn: topicArn,
  };

  return new Promise((resolve, reject) => {
    sns.publish(payload, (error, data) => {
      if (error) {
        return reject(`Could not post to ${topicArn}: ${error.message}`);
      }

      return resolve(`OK: sent SNS message: ${data.MessageId}`);
    });
  });
}

module.exports = publishMessage;

const processMessage = require('../src/process-message');
const verifyUrl = require('../src/verify-url');

function route(request) {
  return new Promise((resolve, reject) => {
    if (typeof request.body !== 'object') {
      return reject('Unexepcted request format.');
    }

    if (request.body.token !== process.env.SLACK_APP_VERIFICATION_TOKEN) {
      return reject('Invalid app verification token.');
    }

    if (request.body.type === 'url_verification') {
      return verifyUrl(request.body).then(resolve).catch(reject);
    }

    if (request.body.type === 'event_callback') {
      return processMessage(request.body.event).then(resolve).catch(reject);
    }

    return reject('Unexpected event type.');
  }).catch((error) => {
    console.log(error); // Logged errors show up in CloudWatch.
    return Promise.reject(error);
  });
}

module.exports = route;

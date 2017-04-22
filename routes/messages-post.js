const verifyUrl = require('../src/verify-url');

function route(request) {
  if (typeof request.body !== 'object') {
    return Promise.reject('Unexepcted request format.');
  }

  if (request.body.token !== process.env.SLACK_APP_VERIFICATION_TOKEN) {
    return Promise.reject('Invalid app verification token.');
  }

  if (request.body.type === 'url_verification') {
    return verifyUrl(request.body);
  }

  /* Handle other event types here. */

  return Promise.reject('Unexpected event type.');
}

module.exports = route;

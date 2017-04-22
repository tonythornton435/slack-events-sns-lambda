require('dotenv').config();

const test = require('ava');
const api = require('../index');

const apiRequest = {
  requestContext: {
    httpMethod: 'POST',
    resourcePath: '/messages',
  },
  body: {
    token: process.env.SLACK_APP_VERIFICATION_TOKEN,
    type: 'event_callback',
  },
};

test('process message failure (invalid event type)', (t) => {
  const event = {
    text: `${process.env.SLACK_MACHINE_USER_NAME} hello`,
    type: 'fake_event',
  };
  const badRequest = {
    requestContext: apiRequest.requestContext,
    body: Object.assign({}, apiRequest.body, { event }),
  };
  const expectedErrorMessage = `Unsupported event type: ${event.type}`;

  return api.proxyRouter(badRequest, {
    done: (error, response) => {
      t.is(500, response.statusCode);
      t.is(JSON.stringify({ errorMessage: expectedErrorMessage }), response.body);
    },
  });
});

test('process message failure (none of my business)', (t) => {
  const event = {
    text: `not ${process.env.SLACK_MACHINE_USER_NAME} hello`,
    type: 'message.channels',
  };
  const badRequest = {
    requestContext: apiRequest.requestContext,
    body: Object.assign({}, apiRequest.body, { event }),
  };
  const expectedMessage = 'OK: ignored message: not for me';

  return api.proxyRouter(badRequest, {
    done: (error, response) => {
      t.is(200, response.statusCode);
      t.is(JSON.stringify(expectedMessage), response.body);
    },
  });
});

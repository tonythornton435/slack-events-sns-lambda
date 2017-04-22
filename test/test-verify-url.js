require('dotenv').config();

const test = require('ava');
const api = require('../index');

const challengeToken = 'fake_challenge_token';
const apiRequest = {
  requestContext: {
    httpMethod: 'POST',
    resourcePath: '/messages',
  },
  body: {
    challenge: challengeToken,
    token: process.env.SLACK_APP_VERIFICATION_TOKEN,
    type: 'url_verification',
  },
};

const expectedResponse = {
  challenge: challengeToken,
};

test('verify url failure (wrong token)', (t) => {
  const badRequest = {
    requestContext: apiRequest.requestContext,
    body: Object.assign({}, apiRequest.body, { token: 'bad_token' }),
  };
  const expectedErrorMessage = 'Invalid app verification token.';

  return api.proxyRouter(badRequest, {
    done: (error, response) => {
      t.is(500, response.statusCode);
      t.is(JSON.stringify({ errorMessage: expectedErrorMessage }), response.body);
    },
  });
});

test('verify url failure (wrong event type)', (t) => {
  const badRequest = {
    requestContext: apiRequest.requestContext,
    body: Object.assign({}, apiRequest.body, { type: 'fake_type' }),
  };
  const expectedErrorMessage = 'Unexpected event type.';

  return api.proxyRouter(badRequest, {
    done: (error, response) => {
      t.is(500, response.statusCode);
      t.is(JSON.stringify({ errorMessage: expectedErrorMessage }), response.body);
    },
  });
});

test('verify url success', t => api.proxyRouter(apiRequest, {
  done: (error, response) => {
    t.is(200, response.statusCode);
    t.is(JSON.stringify(expectedResponse), response.body);
  },
}));

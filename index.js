require('dotenv').config();

const ApiBuilder = require('claudia-api-builder');

const api = new ApiBuilder();

api.post('/messages', require('./routes/messages-post'));

module.exports = api;

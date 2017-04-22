function verifyUrl(data) {
  return Promise.resolve({ challenge: data.challenge });
}

module.exports = verifyUrl;

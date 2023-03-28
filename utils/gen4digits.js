const crypto = require("crypto");

const random4Digits = () => {
  const randomNumber = crypto.randomInt(8999) + 1000;
  return randomNumber.toString();
};

module.exports = { random4Digits };

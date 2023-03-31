const config = require("../config");

const jwt = require("jsonwebtoken");

function generateToken(user_id, minutes) {
  const exp = Math.floor(Date.now() / 1000) + (60 * minutes);
  const token = jwt.sign({ user_id, exp }, config.JWTSecretKey);
  return token;
}

function decodeToken(token, callback) {
  jwt.verify(token, config.JWTSecretKey, function (err, decoded) {
    callback(err, decoded);
  });
}

module.exports = {
  generateToken,
  decodeToken,
};

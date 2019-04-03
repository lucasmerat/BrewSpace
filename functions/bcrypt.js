var bcrypt = require("bcrypt");

Encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};
Decrypt = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};
module.exports = Encrypt;
module.exports = Decrypt;

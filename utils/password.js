// Dependencies
const crypto = require("crypto");

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 */
const genHashPassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

  return {
    salt,
    hashPassword,
  };
};

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validatePassword(password, hash, salt) {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === hashVerify;
}

module.exports = { genHashPassword, validatePassword };

/**
 * This module will generate a public and private keypair and save to secrets folder
 *
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const genKeyPair = () => {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(path.join(__dirname, "..", "secrets", "rsaPubKey.pem"), keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(path.join(__dirname, "..", "secrets", "rsaPrivKey.pem"), keyPair.privateKey);
};

module.exports = {
  genKeyPair,
};

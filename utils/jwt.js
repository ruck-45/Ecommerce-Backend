const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "secrets", "rsaPrivKey.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

function issueJWT(userId, remember) {
  const expiresIn = remember ? "7d" : "1d";
  const payload = {
    uid: userId,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: "RS256" });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
}

module.exports = {
  issueJWT,
};

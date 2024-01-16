const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "secrets", "rsaPrivKey.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

function issueJWT(userId, remember) {
  const expiresIn = remember ? 7 : 1;
  const payload = {
    uid: userId,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: `${expiresIn}d`, algorithm: "RS256" });

  return {
    token: signedToken,
    expires: expiresIn,
  };
}

module.exports = {
  issueJWT,
};

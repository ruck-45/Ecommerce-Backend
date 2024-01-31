const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "secrets", "rsaPrivKey.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

function issueJWT(userId, duration, unit) {
  let expiresIn = "";
  if (typeof duration === "number" && (unit === "m" || unit === "d")) {
    expiresIn = `${duration}${unit}`;
  } else {
    throw new Error("Invalid duration or unit provided");
  }

  const payload = {
    uid: userId,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, { expiresIn, algorithm: "RS256" });

  return {
    token: signedToken,
    expires: duration,
  };
}

module.exports = {
  issueJWT,
};

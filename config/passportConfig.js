// Dependencies
const fs = require("fs");
const path = require("path");
const { Strategy, ExtractJwt } = require("passport-jwt");

// Local Files
const { executeQuery } = require("../utils/database");
const { findUserIdQuery } = require("../constants/queries");

const pathToKey = path.join(__dirname, "..", "secrets", "rsaPubKey.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new Strategy(options, (payload, done) => {
  executeQuery(findUserIdQuery, [payload.uid])
    .then((qreryRes) => {
      const userDetails = qreryRes.result[0];
      if (userDetails.length === 0) {
        done(null, false);
      } else {
        done(null, userDetails[0]);
      }
    })
    .catch((err) => done(err));
});

module.exports = (passport) => {
  passport.use(strategy);
};

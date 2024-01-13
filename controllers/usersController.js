// Local Files
const { genHashPassword } = require("../utils/password");
const { insertUser } = require("../utils/database");

const genUid = (counter) => {
  // Timestamp component (DDMMYY)
  const currentDate = new Date();
  const yearComponent = currentDate.getUTCFullYear().toString().slice(2, 4); // Extract the last two digits of the year
  const monthComponent = (currentDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const dayComponent = currentDate.getUTCDate().toString().padStart(2, "0");
  const hourComponent = currentDate.getUTCHours().toString().padStart(2, "0");
  const minuteComponent = currentDate.getUTCMinutes().toString().padStart(2, "0");
  const secondComponent = currentDate.getUTCSeconds().toString().padStart(2, "0");

  const timestampComponent = `${yearComponent}${monthComponent}${dayComponent}${hourComponent}${minuteComponent}${secondComponent}`;

  // Random component (5 digits)
  const randomComponent = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  // Counter Component - Resets every Day
  const counterComponent = counter.toString().padStart(5, "0");

  // UserId
  const userId = timestampComponent + randomComponent + counterComponent;

  return userId;
};

/**
 *
 * username : maximum char - 50
 * email : maximum char - 100
 *
 */

const createUser = async (req, res) => {
  const { username, email, password, registerCounter } = req.body;

  // Return If Partial Information Provided
  if (username === undefined || email === undefined || password === undefined) {
    return res.status(206).json({ success: false, message: "Partial Content Provided" });
  }

  // Return If Data Exceeds Length
  if (username.length > 50 || email.length > 100) {
    return res.status(406).json({ success: false, message: "Data Not Acceptable" });
  }

  // Hash Password generation
  const { salt, hashPassword } = genHashPassword(password);

  // User Id generation
  const userId = genUid(registerCounter);

  // Insert Into Database
  const details = [userId, username, salt, hashPassword, email];
  const success = await insertUser(details);

  if (!success) {
    return res.status(501).json({ success: false, message: "User Creation Failed" });
  }

  return res.status(201).json({ success: true, message: "User Creation Successful" });
};

module.exports = {
  createUser,
};

// Local Files
const { genHashPassword, validatePassword } = require("../utils/password");
const { issueJWT } = require("../utils/jwt");
const { executeQuery } = require("../utils/database");
const {
  insertUserDetailsQuery,
  findUserEmailQuery,
  checkEmployeeQuery,
  initializeUserProfile,
  getUserProfile,
  updateProfileInfo,
} = require("../constants/queries");

// ********************************** Util Functions ***********************************************

const genUid = (counter) => {
  // Timestamp component (YYYYMMDDHHMMSS)
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

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

// ********************************** signup ***********************************************

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
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  // Return If Data Exceeds Length
  if (username.length > 50 || email.length > 100) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  // Hash Password generation
  const { salt, hashPassword } = genHashPassword(password);

  // User Id generation
  const userId = genUid(registerCounter);

  // Insert Into Database
  const details = [userId, username, salt, hashPassword, email];
  const qreryRes = await executeQuery(insertUserDetailsQuery, details);

  // Return If Creation Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, payload: qreryRes.result });
  }

  // Initialize Profile Database
  const qreryRes2 = await executeQuery(initializeUserProfile, [userId]);
  const profileInitMessage = qreryRes2.success
    ? {
        profileInitializationSuccess: qreryRes2.success,
        profilePayload: { profileMessage: "Profile Initialization Successful." },
      }
    : {
        profileInitializationSuccess: qreryRes2.success,
        profilePayload: qreryRes2.result,
      };

  return res
    .status(201)
    .json({ success: true, payload: { message: "User Creation Successful", ...profileInitMessage } });
};

// ********************************** login ***********************************************

/**
 *
 * email : maximum char - 100
 * remember : Boolean
 *
 */

const loginUser = async (req, res) => {
  const { email, password, remember } = req.body;

  // Return If Partial Information Provided
  if (email === undefined || remember === undefined || password === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  // Return If Data Exceeds Length
  if (email.length > 100) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  // Search User In Database
  const qreryRes = await executeQuery(findUserEmailQuery, [email]);
  const userDetails = qreryRes.result[0];

  // Return If Query Unsuccessful
  if (userDetails.length === 0) {
    return res.status(401).json({ success: false, payload: { message: "User Not Found" } });
  }

  // Extracting user Details
  const userId = userDetails[0].user_id;
  const salt = userDetails[0].password_salt;
  const hashPassword = userDetails[0].password_hash;

  // Validating Password
  const passwordValidity = validatePassword(password, hashPassword, salt);

  // Return If Invalid Password
  if (!passwordValidity) {
    return res.status(401).json({ success: false, payload: { message: "Invalid Password" } });
  }

  // Issue JWT
  const jwt = issueJWT(userId, remember);

  // Check If User is a registered TMIS employee
  let isEmployee = true;
  const qreryRes2 = await executeQuery(checkEmployeeQuery, [userId]);
  const employeeDetails = qreryRes2.result[0];
  if (employeeDetails.length === 0) {
    isEmployee = false;
  }

  return res
    .status(201)
    .json({ success: true, payload: { message: "User Authenticated Successfully", isEmployee, ...jwt } });
};

// ********************************** profile ***********************************************

const getProfile = async (req, res) => {
  // Get User Profile Details
  const userId = req.user.user_id;
  const qreryRes = await executeQuery(getUserProfile, [userId]);

  // Return If Query Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, payload: qreryRes.result });
  }

  return res.status(200).json({ status: "success", payload: { ...qreryRes.result[0][0] } });
};

/**
 *
 * profession : maximum char - 255
 * phone : maximum char - 20
 *
 */

const updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { about, profession, address, phone } = req.body;

  // Return If Partial Information Provided
  if (about === undefined || profession === undefined || address === undefined || phone === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  // Return If Data Exceeds Length
  if (profession.length > 255 || phone.length > 20) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  // Update Profile Details In Database
  const details = [about, profession, address, phone, userId];
  const qreryRes = await executeQuery(updateProfileInfo, details);

  // Return If Query Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, payload: qreryRes.result });
  }

  return res.status(200).json({ success: qreryRes.success, payload: { message: "Profile Info Successfully Updated" } });
};

module.exports = {
  createUser,
  loginUser,
  getProfile,
  updateProfile,
};

require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Local Files
const { genHashPassword, validatePassword } = require("../utils/password");
const { issueJWT } = require("../utils/jwt");
const { executeQuery } = require("../utils/database");
const {
  insertUserDetailsQuery,
  findUserEmailQuery,
  initializeUserProfile,
  getUserProfile,
  updateProfileInfo,
  checkEmployeeQuery,
  changePassword,
} = require("../constants/queries");

const { sendEmail } = require("../utils/sendmail");

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
  let profileInitMessage = {};
  if (qreryRes2.success) {
    // Profile Initialization Successful
    const defaultImageFilename = "default.jpg";
    const userImageFilename = `${userId}.jpg`;

    const defaultImagePath = path.join(__dirname, "../public", "userImages", defaultImageFilename);
    const userImagePath = path.join(__dirname, "../public", "userImages", userImageFilename);

    // Read the contents of the default image file
    const defaultImageBuffer = fs.readFileSync(defaultImagePath);

    // Write the contents to the user's folder with the user-specific filename
    fs.writeFileSync(userImagePath, defaultImageBuffer);

    profileInitMessage = {
      profileInitializationSuccess: true,
      profilePayload: { profileMessage: "Profile Initialization Successful." },
    };
  } else {
    // Profile Initialization Failed
    profileInitMessage = {
      profileInitializationSuccess: false,
      profilePayload: qreryRes2.result,
    };
  }

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
    return res.status(404).json({ success: false, payload: { message: "User Not Found" } });
  }

  // Extracting user Details
  const userId = userDetails[0].user_id;
  const salt = userDetails[0].password_salt;
  const hashPassword = userDetails[0].password_hash;
  const userName = userDetails[0].username;

  // Validating Password
  const passwordValidity = validatePassword(password, hashPassword, salt);

  // Return If Invalid Password
  if (!passwordValidity) {
    return res.status(401).json({ success: false, payload: { message: "Invalid Password" } });
  }

  // Issue JWT
  const jwt = issueJWT(userId, remember ? 7 : 1, "d");

  // Check If User is a registered hms employee
  let isEmployee = false;
  const qreryRes2 = await executeQuery(checkEmployeeQuery, [userId]);
  const employeeDetails = qreryRes2.result[0];
  if (employeeDetails.length > 0) {
    isEmployee = true;
  }

  return res.status(201).json({
    success: true,
    payload: {
      message: "User Authenticated Successfully",
      userName,
      userId,
      isEmployee, // Include the isEmployee flag in the response
      ...jwt,
    },
  });
};

// ********************************** profile ***********************************************

const getProfile = async (req, res) => {
  // Get User Profile Details
  const userId = req.user.user_id;
  const qreryRes = await executeQuery(getUserProfile, [userId]);

  // Return If Query Unsuccessful
  if (!qreryRes.success) {
    return res
      .status(404)
      .json({ success: qreryRes.success, payload: { message: "User Data Not Found", result: qreryRes.result } });
  }

  return res.status(200).json({ status: "success", payload: { ...qreryRes.result[0][0] } });
};

const updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { phone, address, state, addressCode } = req.body;

  // Return If Partial Information Provided
  if (phone === undefined || address === undefined || state === undefined || addressCode === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  // Return If Data Exceeds Length
  if (phone.length > 20) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  // Update Profile Details In Database
  const details = [address, phone, state, addressCode, userId];
  const qreryRes = await executeQuery(updateProfileInfo, details);

  // Return If Query Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, payload: qreryRes.result });
  }

  return res.status(200).json({ success: qreryRes.success, payload: { message: "Profile Info Successfully Updated" } });
};

const updateProfileImage = async (req, res) => {
  // Return If No File Uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, payload: { message: "File Not Found" } });
  }

  return res.status(200).json({ success: true, payload: { message: "Profile Picture Updated Successfully" } });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (email === undefined) {
      return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
    }

    const qreryRes = await executeQuery(findUserEmailQuery, [email]);
    const userDetails = qreryRes.result[0];
    if (userDetails.length === 0) {
      return res.status(404).json({ success: false, payload: { message: "User Not Found" } });
    }

    const userId = userDetails[0].user_id;

    const { token } = issueJWT(userId, 10, "m");
    const resetPasswordURL = `${process.env.FRONTEND_URL}/ResetPassword?state=reset&&token=${token}`;
    const linkText = "Click here";
    const linkElement = `<a href="${resetPasswordURL}">${linkText}</a>`;
    const subject = "ShopNest reset password";
    const message = `you can reset your password here :  ${linkElement}`;
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      payload: { message: `reset password token sent to mail id ${email} succesfully` },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      payload: { message: error },
    });
  }
};

const resetPassword = async (req, res) => {
  const userId = req.user.user_id;
  const { password } = req.body;
  if (password === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }
  const { salt, hashPassword } = genHashPassword(password);

  const details = [salt, hashPassword, userId];
  const queryResult = await executeQuery(changePassword, details);

  if (!queryResult.success) {
    return res.status(501).json({ success: false, payload: queryResult.result });
  }

  return res.status(201).json({ success: true, payload: { message: "Password changed successfully." } });
};

module.exports = {
  createUser,
  loginUser,
  getProfile,
  updateProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
};

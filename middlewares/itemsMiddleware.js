const { checkEmployeeQuery } = require("../constants/queries");
const { executeQuery } = require("../utils/database");

let lastResetDate = new Date().getUTCDate();
let registerCounter = 0;

const updateRegisterCounter = (req, res, next) => {
  registerCounter += 1;
  const currentDay = new Date().getUTCDate();

  if (currentDay !== lastResetDate) {
    registerCounter = 1;
    lastResetDate = currentDay;
  }

  req.body.registerCounter = registerCounter;
  next();
};

const ensureEmployee = async (req, res, next) => {
  const userId = req.user.user_id;

  const qreryRes2 = await executeQuery(checkEmployeeQuery, [userId]);
  const employeeDetails = qreryRes2.result[0];
  if (employeeDetails.length === 0) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

module.exports = {
  updateRegisterCounter,
  ensureEmployee,
};

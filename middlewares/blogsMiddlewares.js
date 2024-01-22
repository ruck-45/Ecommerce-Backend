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

const ensureEmployee= (req, res, next) => {
  if (req.isAuthenticated() && req.user.isEmployee) {
    return next();
  }   
  return res.status(403).send("Unauthorized");
}


module.exports = {
  updateRegisterCounter,
  ensureEmployee,
};

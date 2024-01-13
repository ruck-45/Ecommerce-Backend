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

module.exports = {
  updateRegisterCounter,
};

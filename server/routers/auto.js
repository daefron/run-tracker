const authController = require("../controllers/authController");
const fitbitDataController = require("../controllers/fitbitDataController");

const runFetchDelay = 1800000;
const refreshAuthDelay = 27000000;

function timers() {
  setInterval(() => {
    fitbitDataController.updateGet();
  }, runFetchDelay);
  console.log(
    "Run auto-updater running. Interval = " + runFetchDelay / 60000 + " mins"
  );
  authController.refreshAuth();
  setInterval(() => {
    authController.refreshAuth();
  }, refreshAuthDelay);
  console.log(
    "Auth refresh auto-updater running. Interval = " +
      refreshAuthDelay / 60000 +
      " mins"
  );
}

module.exports = {
  timers,
};

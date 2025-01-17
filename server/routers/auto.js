const authController = require("../controllers/authController");
const fitbitDataController = require("../controllers/fitbitDataController");

const runFetchDelay = 900000;
const refreshAuthDelay = 14400000;

function timers() {
  setInterval(() => {
    fitbitDataController.fetchRuns();
  }, runFetchDelay);
  console.log(
    "Run auto-updater running. Interval = " + runFetchDelay / 60000 + " mins"
  );
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

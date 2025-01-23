const authController = require("../controllers/authController");
const fitbitDataController = require("../controllers/fitbitDataController");

function timers() {
  //time between run updates (30 mins)
  const runFetchDelay = 1800000;
  const runFetchFunc = () => fitbitDataController.updateGet();
  autoTimer(runFetchDelay, runFetchFunc());
  console.log(
    "Run auto-updater running. Interval = " + runFetchDelay / 60000 + " mins"
  );

  //time between auth refresh updates (7.5 hours as tokens last 8 hours)
  const refreshAuthDelay = 27000000;
  const refreshAuthFunc = () => authController.refreshAuth();
  autoTimer(refreshAuthDelay, refreshAuthFunc());
  console.log(
    "Auth refresh auto-updater running. Interval = " +
      refreshAuthDelay / 60000 +
      " mins"
  );

  //pings the server to keep it awake (14 mins as server times out after 15 mins)
  const pingDelay = 840000;
  const pingFunc = () => console.log("ping");
  autoTimer(pingDelay, pingFunc());

  function autoTimer(delay, func) {
    setInterval(() => {
      func;
    }, delay);
  }
}

module.exports = {
  timers,
};

const authController = require("../controllers/authController");
const fitbitDataController = require("../controllers/fitbitDataController");

function timers() {
  //time between run updates (30 mins)
  const runFetchDelay = 1800000;
  autoTimer(runFetchDelay, fitbitDataController.updateGet());
  console.log(
    "Run auto-updater running. Interval = " + runFetchDelay / 60000 + " mins"
  );

  //time between auth refresh updates (7.5 hours as tokens last 8 hours)
  const refreshAuthDelay = 27000000;
  autoTimer(refreshAuthDelay, authController.refreshAuth());
  console.log(
    "Auth refresh auto-updater running. Interval = " +
      refreshAuthDelay / 60000 +
      " mins"
  );

  //time between server pings (14 minutes as server sleeps after 15 mins)
  const serverPing = 840000;
  autoTimer(serverPing, console.log("ping"));
  console.log(
    "Server pinger running. Interval = " + serverPing / 60000 + " mins"
  );

  function autoTimer(delay, func) {
    setInterval(() => {
      func;
    }, delay);
  }
}

module.exports = {
  timers,
};

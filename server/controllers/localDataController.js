const db = require("../db/pool");
const runTools = require("./runTools");

async function launchGet(req, res) {
  const localRunsQuery = await db.query(
    "SELECT data FROM run_list WHERE owner = $1",
    [process.env.owner]
  );
  const localRuns = localRunsQuery.rows[0].data;

  let formattedRuns = [];
  for (let i = 0; i < localRuns.length; i++) {
    const run = localRuns[i];
    const runDataQuery = await db.query(
      'SELECT * FROM "runs" WHERE logid = $1',
      [run.logId]
    );
    const runData = runDataQuery.rows[0];
    run.heartRateArray = runData.hrdata;
    run.stepsArray = runData.stepdata;
    run.temperature = runData.weatherdata;
    run.index = i;
    const newRun = new runTools.Run(run);
    newRun.lastRun = formattedRuns[i + 1];
    if (newRun.lastRun) {
      runTools.compareRuns(newRun);
    }
    formattedRuns.push(newRun);
  }
  const lastUpdatedQuery = await db.query(
    "SELECT last_updated FROM run_list WHERE owner = $1",
    [process.env.owner]
  );
  const lastUpdated = lastUpdatedQuery.rows[0].last_updated;
  res.json({ data: formattedRuns, lastUpdated: lastUpdated });
  console.log("Sent most recent run list");
  return;
}

module.exports = {
  launchGet,
};

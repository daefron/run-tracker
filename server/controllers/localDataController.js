const db = require("../db/pool");

async function launchGet(req, res) {
  console.log(process.env.owner, process.env.database);
  const localRunsQuery = await db.query(
    "SELECT data FROM run_list WHERE owner = $1",
    [process.env.owner]
  );
  const localRuns = localRunsQuery.rows[0].data;
  let formattedRuns = [];
  for (let run of localRuns) {
    const runDataQuery = await db.query(
      'SELECT * FROM "runs" WHERE logid = $1',
      [run.logId]
    );
    const runData = runDataQuery.rows[0];
    run.heartRateArray = runData.hrdata;
    run.stepsArray = runData.stepdata;
    formattedRuns.push(run);
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

const db = require("../db/pool");

async function launchGet(req, res) {
  const localRunsQuery = await db.query(
    'SELECT "data" FROM "run_list" WHERE "id" = (SELECT max("id") FROM "run_list")'
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
  console.log("Sent most recent run list");
  res.json({ data: formattedRuns });
  return;
}

module.exports = {
  launchGet,
};

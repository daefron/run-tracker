const db = require("../db/pool");

async function launchGet(req, res) {
  const localRunsQuery = await db.query(
    "SELECT processed_data FROM run_list WHERE owner = $1",
    [process.env.owner]
  );
  const localRuns = localRunsQuery.rows[0].data;

  const lastUpdatedQuery = await db.query(
    "SELECT last_updated FROM run_list WHERE owner = $1",
    [process.env.owner]
  );
  const lastUpdated = lastUpdatedQuery.rows[0].last_updated;

  res.json({ data: localRuns, lastUpdated: lastUpdated });
  console.log("Sent most recent run list");
  return;
}

module.exports = {
  launchGet,
};

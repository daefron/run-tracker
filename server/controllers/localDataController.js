const db = require("../db/pool");
const { heartRateArrayParse, stepsArrayParse } = require("./runTools");

async function launchGet(req, res) {
  const lastUpdated = (
    await db.query("SELECT last_updated FROM users WHERE owner = $1", [
      process.env.owner,
    ])
  ).rows[0].last_updated;
  const runIds = (
    await db.query(
      "SELECT id_array FROM users WHERE owner = $1",
      [process.env.owner]
    )
  ).rows[0].id_array;
  const localRuns = (
    await db.query("SELECT * FROM runs WHERE owner = $1", ["CC83GK"])
  ).rows;
  let runs = [];
  runIds.forEach((id) => {
    let run = localRuns.find((run) => run.logid == id).data;
    let parsedRun = run.data;
    parsedRun.heartRateArray = heartRateArrayParse(run.hr_data);
    parsedRun.stepsArray = stepsArrayParse(run.step_data);
    parsedRun.temp = run.weather_data;
    parsedRun.render.temp = run.weather_data + " °C";
    runs.push(parsedRun);
  });
  res.json({ data: runs, lastUpdated: lastUpdated });
  console.log("Sent most recent run list");
  return;
}

module.exports = {
  launchGet,
};

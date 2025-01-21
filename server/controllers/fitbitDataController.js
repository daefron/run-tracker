const db = require("../db/pool");
const auth = require("../tools/auth");
const { linkMaker } = require("../tools/linkMaker");

async function updateGet(req, res) {
  const lastAuth = await auth.getLastAuth();
  if (lastAuth) {
    await db.query("UPDATE run_list SET last_updated = $1", [Date.now()]);
    const fetchAuth = {
      headers: {
        Authorization: "Bearer " + lastAuth.access_token,
      },
    };
    const localRunsQuery = await db.query(
      "SELECT data FROM run_list WHERE owner = $1",
      [process.env.owner]
    );
    let localRuns;
    if (localRunsQuery.rows[0]) {
      localRuns = localRunsQuery.rows[0].data;
    }
    fetchRuns();
    async function dataOrError(response) {
      console.log("Fetching data");
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      } else {
        return response.json();
      }
    }
    async function fetchRuns() {
      fetch(
        "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
        fetchAuth
      )
        .then((response) => {
          return dataOrError(response);
        })
        .catch((error) => {
          return error;
        })
        .then(async (data) => {
          if (data instanceof Error) {
            console.log(data);
            return;
          }
          const fitbitActivities = data.activities;
          let fitbitRuns = [];
          for (const activity of fitbitActivities) {
            if (activity.activityName === "Run") {
              fitbitRuns.push(activity);
            }
          }
          if (
            localRuns &&
            JSON.stringify(fitbitRuns) === JSON.stringify(localRuns)
          ) {
            console.log("Activity data up to date.");
          } else {
            await db.query("UPDATE run_list SET data = $1, owner = $2", [
              JSON.stringify(fitbitRuns),
              process.env.owner,
            ]);
            console.log("Inserted updated run list.");
          }
          for (let i = 0; i < fitbitRuns.length; i++) {
            let lastRun, idMade, hrMade, stepsMade, weatherMade;
            if (i === fitbitRuns.length - 1) {
              lastRun = true;
            }
            const run = fitbitRuns[i];
            let localRunQuery = await db.query(
              "SELECT * FROM runs WHERE logid = $1",
              [run.logId]
            );
            let localRun = localRunQuery.rows[0];
            if (!localRun) {
              await db.query(
                "INSERT INTO runs (logid, hrdata, stepdata, weatherdata) VALUES ($1, $2, $3, $4)",
                [run.logId, null, null, null]
              );
              localRunQuery = await db.query(
                "SELECT * FROM runs WHERE logid = $1",
                [run.logId]
              );
              localRun = localRunQuery.rows[0];
              idMade = true;
            } else {
              idMade = true;
            }
            async function intradayFetch(typeName, sqlName, link) {
              fetch(link, fetchAuth)
                .then((response) => {
                  return dataOrError(response);
                })
                .catch((error) => {
                  return error;
                })
                .then(async (data) => {
                  if (data instanceof Error) {
                    console.log(data);
                    return;
                  }
                  await db.query(
                    'UPDATE runs SET "' + sqlName + '" = $1 WHERE logid = $2',
                    [
                      JSON.stringify(
                        data["activities-" + typeName + "-intraday"].dataset
                      ),
                      localRun.logid,
                    ]
                  );
                });
            }
            if (localRun && localRun.hrdata === null) {
              intradayFetch("heart", "hrdata", run.heartRateLink);
            } else {
              hrMade = true;
            }
            if (localRun && localRun.stepdata === null) {
              intradayFetch("steps", "stepdata", linkMaker("steps", run));
            } else {
              stepsMade = true;
            }
            if (localRun && localRun.weatherdata === null) {
              weatherFetch(run);
            } else {
              weatherMade = true;
            }
            function weatherFetch(run) {
              const weatherTime = run.originalStartTime.split(":")[0];
              const latitude = -37.814;
              const longitude = 144.9633;
              fetch(
                "https://api.open-meteo.com/v1/forecast?latitude=" +
                  latitude +
                  "&longitude=" +
                  longitude +
                  "&hourly=temperature_2m&past_days=92",
                {
                  headers: {
                    "Content-Type": "text/html",
                  },
                  method: "GET",
                }
              )
                .then((res) => {
                  return res.json();
                })
                .then(async (data) => {
                  const timeArray = data.hourly.time;
                  const tempArray = data.hourly.temperature_2m;
                  const GMTDiff = 11;
                  const timePosition = () => {
                    for (let i = 0; i < timeArray.length; i++) {
                      if (timeArray[i].split(":")[0] === weatherTime) {
                        return i + GMTDiff;
                      }
                    }
                  };
                  const temp = tempArray[timePosition()];
                  await db.query(
                    "UPDATE runs SET weatherdata = $1 WHERE logid = $2",
                    [temp, localRun.logid]
                  );
                });
            }
            if (lastRun && idMade && hrMade && stepsMade && weatherMade) {
              console.log("All runs finished updating.");
              if (req) {
                res.send("Refreshed");
              }
              return;
            }
          }
        });
    }
  } else {
    console.log("Authentication broken.");
    return;
  }
}

module.exports = {
  updateGet,
};

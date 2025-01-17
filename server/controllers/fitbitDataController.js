const db = require("../db/pool");
const auth = require("../tools/auth");
const { linkMaker } = require("../tools/linkMaker");

async function updateGet(req, res) {
  const lastAuth = await auth.getLastAuth();
  if (lastAuth) {
    const fetchAuth = {
      headers: {
        Authorization: "Bearer " + lastAuth.access,
      },
    };
    const localRunsQuery = await db.query(
      'SELECT "data" FROM "run_list" WHERE "id" = (SELECT max("id") FROM "run_list")'
    );
    let localRuns;
    if (localRunsQuery.rows[0]) {
      localRuns = localRunsQuery.rows[0].data;
    }
    fetchRuns();
    async function fetchRuns() {
      fetch(
        "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
        fetchAuth
      )
        .then((response) => {
          console.log("Fetching data");
          if (!response.ok) {
            throw new Error(
              response.status + " " + response.statusText + " at ACTIVITY LIST"
            );
          } else {
            return response.json();
          }
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
            await db.query('INSERT INTO "run_list" (data) VALUES ($1)', [
              JSON.stringify(fitbitRuns),
            ]);
            console.log("Inserted updated run list.");
          }
          for (let i = 0; i < fitbitRuns.length; i++) {
            let lastRun, idMade, hrMade, stepsMade;
            if (i === fitbitRuns.length - 1) {
              lastRun = true;
            }
            const run = fitbitRuns[i];
            const localRunQuery = await db.query(
              'SELECT * FROM "runs" WHERE logid = $1',
              [run.logId]
            );
            const localRun = localRunQuery.rows[0];
            if (!localRun) {
              await db.query(
                'INSERT INTO "runs" (logid, hrdata, stepdata) VALUES ($1, $2, $3)',
                [run.logId, null, null]
              );
              idMade = true;
            } else {
              idMade = true;
            }
            if (localRun && localRun.hrdata === null) {
              async function intradayHr(run) {
                fetch(run.heartRateLink, fetchAuth)
                  .then((response) => {
                    console.log("Fethcing hr");
                    if (!response.ok) {
                      throw new Error(
                        response.status +
                          " " +
                          response.statusText +
                          " at INTRADAYHR"
                      );
                    } else {
                      return response.json();
                    }
                  })
                  .catch((error) => {
                    return error;
                  })
                  .then(async (data) => {
                    if (data instanceof Error) {
                      console.log(data);
                      return;
                    }
                    hr = data["activities-heart-intraday"].dataset;
                    await db.query(
                      'UPDATE "runs" SET "hrdata" = $1 WHERE "logid" = $2',
                      [JSON.stringify(hr), localRun.logid]
                    );
                    hrMade = true;
                  });
              }
              intradayHr(run);
            } else {
              hrMade = true;
            }
            if (localRun && localRun.stepdata === null) {
              async function intradaySteps(run) {
                fetch(linkMaker("steps", run), fetchAuth)
                  .then((response) => {
                    console.log("Fetching steps");
                    if (!response.ok) {
                      throw new Error(
                        response.status +
                          " " +
                          response.statusText +
                          " at INTRADAYSTEPS"
                      );
                    } else {
                      return response.json();
                    }
                  })
                  .catch((error) => {
                    return error;
                  })
                  .then(async (data) => {
                    if (data instanceof Error) {
                      console.log(data);
                      return;
                    }
                    steps = data["activities-steps-intraday"].dataset;
                    await db.query(
                      'UPDATE "runs" SET "stepdata" = $1 WHERE "logid" = $2',
                      [JSON.stringify(steps), localRun.logid]
                    );
                    stepsMade = true;
                  });
              }
              intradaySteps(run);
            } else {
              stepsMade = true;
            }
            if (lastRun && idMade && hrMade && stepsMade) {
              console.log("All runs finished updating.");
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

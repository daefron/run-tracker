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
            async function intradayFetch(typeName, sqlName, link) {
              fetch(link, fetchAuth)
                .then((response) => {
                  console.log("Fetching " + typeName + ".");
                  if (!response.ok) {
                    throw new Error(
                      response.status +
                        " " +
                        response.statusText +
                        " at intraday-" +
                        typeName
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
                  await db.query(
                    'UPDATE "runs" SET "' +
                      sqlName +
                      '" = $1 WHERE "logid" = $2',
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

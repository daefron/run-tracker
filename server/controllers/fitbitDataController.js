const db = require("../db/pool");
const auth = require("../tools/auth");
const runTools = require("./runTools");
const { linkMaker } = require("../tools/linkMaker");

async function updatePut(req, res) {
  const lastAuth = await auth.getLastAuth();
  if (lastAuth) {
    await db.query("UPDATE users SET last_updated = $1", [Date.now()]);
    let localIds = (
      await db.query("SELECT id_array FROM users WHERE owner = $1", [
        process.env.owner,
      ])
    ).rows[0].id_array;
    if (!localIds) {
      localIds = [];
    }
    const fetchAuth = {
      headers: {
        Authorization: "Bearer " + lastAuth.access_token,
      },
    };
    async function dataOrError(response) {
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      } else {
        return response.json();
      }
    }
    newIdCheck();
    async function newIdCheck() {
      console.log("Fetching Fitbit activity list.");
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
          const fitbitData = data.activities;
          const fitbitRuns = fitbitData.filter(
            (activity) => activity.activityName === "Run"
          );
          const fitbitIds = fitbitRuns.map((run) => run.logId);
          const newIds = fitbitIds.filter((id) => !localIds.includes(id));
          if (newIds[0]) {
            console.log("New runs detected, updating runs.");
            newIds.forEach(async (id) => {
              const fitbitRun = fitbitRuns.find((run) => run.logId === id);
              fitbitRun.index = fitbitRuns.indexOf(fitbitRun);
              await db.query(
                "INSERT INTO runs (logId, owner, data, hr_data, step_data, weather_data) VALUES ($1, $2, $3, $4, $5, $6)",
                [
                  fitbitRun.logId,
                  process.env.owner,
                  JSON.stringify(new runTools.Run(fitbitRun)),
                  null,
                  null,
                  null,
                ]
              );
            });
            await db.query("UPDATE users SET id_array = $1 WHERE owner = $2", [
              JSON.stringify(fitbitIds),
              process.env.owner,
            ]);
            return;
          } else {
            console.log("No new runs detected.");
            return;
          }
        });
    }
    updateIdCheck();
    async function updateIdCheck() {
      const allRuns = (
        await db.query("SELECT * FROM runs WHERE owner = $1", [
          process.env.owner,
        ])
      ).rows;
      console.log("Checking runs have all data.");
      allRuns.forEach((run) => {
        if (!run.hr_data) {
          hrData();
        } else if (!run.step_data) {
          stepData();
        } else if (!run.weather_data) {
          weatherData();
        }
        return;

        async function hrData() {
          console.log("Fetching Fitbit run data for " + run.data.id + ".");
          fetch(run.data.heartRateLink, fetchAuth)
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
              await db.query("UPDATE runs SET hr_data = $1 WHERE logid = $2", [
                JSON.stringify(data["activities-heart-intraday"].dataset),
                run.logid,
              ]);
              stepData();
            });
        }
        async function stepData() {
          console.log("Fetching Fitbit step data for " + run.data.id + ".");
          fetch(linkMaker("steps", run.data), fetchAuth)
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
                "UPDATE runs SET step_data = $1 WHERE logid = $2",
                [
                  JSON.stringify(data["activities-steps-intraday"].dataset),
                  run.logid,
                ]
              );
              weatherData();
            });
        }
        async function weatherData() {
          console.log("Fetching weather data for " + run.data.id + ".");
          const weatherTime = run.data.originalStartTime.split(":")[0];
          const latitude = -37.814;
          const longitude = 144.9633;
          const url =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&hourly=temperature_2m&past_days=92";
          fetch(url, {
            path: url,
            headers: {
              "Content-Type": "text/html",
            },
            method: "GET",
          })
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
                "UPDATE runs SET weather_data = $1 WHERE logid = $2",
                [temp, run.data.id]
              );
            });
        }
      });
    }
  }
}

module.exports = {
  updatePut,
};

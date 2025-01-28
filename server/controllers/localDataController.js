const db = require("../db/pool");
const {
  dateArray,
  heartRateArrayParse,
  stepsArrayParse,
  compareRuns,
  PredictedRun,
  dateFiller,
  getTotal,
  getAverage,
  renderTime,
  msToObject,
} = require("./runTools");

async function launchGet(req, res) {
  const lastUpdated = (
    await db.query("SELECT last_updated FROM users WHERE owner = $1", [
      process.env.owner,
    ])
  ).rows[0].last_updated;
  const runIds = (
    await db.query("SELECT id_array FROM users WHERE owner = $1", [
      process.env.owner,
    ])
  ).rows[0].id_array;
  const localRuns = (
    await db.query("SELECT * FROM runs WHERE owner = $1", [process.env.owner])
  ).rows;
  let runs = [];
  runIds.forEach((id) => {
    let run = localRuns.find((run) => run.logid == id);
    let parsedRun = run.data;
    const lastRun = localRuns.find((run) => run.data.index === parsedRun.index + 1);
    if (lastRun) {
      compareRuns(parsedRun, lastRun.data);
    }
    parsedRun.heartRateArray = heartRateArrayParse(run.hr_data);
    parsedRun.stepsArray = stepsArrayParse(run.step_data);
    parsedRun.temp = Number(run.weather_data);
    parsedRun.render.temp = run.weather_data + " °C";
    runs.push(parsedRun);
  });
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "steps",
    "calories",
    "temp",
  ];
  const predictedRun = [new PredictedRun(runs)];
  const dateRange = dateArray(runs, predictedRun[0].gap);
  const predictionData = dateFiller(predictedRun, dateRange, types);
  function chartFiller(data) {
    predictedRun.forEach((run) => {
      for (const key in predictionData[run.chartOrder]) {
        data[run.chartOrder][key + "Prediction"] =
          predictionData[run.chartOrder][key];
      }
    });
    return data;
  }
  const chartData = chartFiller(dateFiller(runs, dateRange, types));

  const overallStats = {
    total: totalStats(),
    highest: highestStats(),
    average: averageStats(),
  };

  function totalStats() {
    const totalRuns = findTotal("runs", "");
    const totalDuration = findTotal("duration", "");
    const totalDistance = findTotal("distance", " km");
    function findTotal(unit, renderUnit) {
      let all = runs.map((run) => run[unit]);
      if (unit === "duration") {
        all.forEach((unit, i) => (all[i] = unit));
      } else if (unit === "runs") {
        all.forEach((unit, i) => (all[i] = 1));
      }
      let totalRender = getTotal(all) + renderUnit;
      if (unit === "distance") {
        totalRender = getTotal(all).toFixed(2) + renderUnit;
      } else if (unit === "duration") {
        totalRender = renderTime(msToObject(getTotal(all)));
      }
      return totalRender;
    }
    return {
      runs: totalRuns,
      distance: totalDistance,
      duration: totalDuration,
    };
  }
  function highestStats() {
    const highestDistance = findHighest("distance");
    const highestDuration = findHighest("duration");
    const highestSpeed = findHighest("speed");
    function findHighest(unit) {
      let target = { [unit]: 0 };
      for (let i = 0; i < runs.length; i++) {
        let compareGreater = runs[i][unit];
        let compareLesser = target[unit];
        if (compareGreater > compareLesser) {
          target = runs[i];
        }
      }
      if (unit === "speed") {
        return target.render.date + " - " + target.speed.toFixed(2) + " km/h";
      }
      return target.render.date + " - " + target.render[unit];
    }
    return {
      distance: highestDistance,
      duration: highestDuration,
      speed: highestSpeed,
    };
  }
  function averageStats() {
    const averageDistance = findAverage("distance");
    const averageDuration = findAverage("duration");
    const averageSpeed = findAverage("speed");
    const averageHeartRate = findAverage("heartRate");
    function findAverage(unit) {
      let all = runs.map((run) => run[unit]);
      if (unit === "duration") {
        all.forEach((unit, i) => (all[i] = unit));
      }
      const average = getAverage(all);
      if (unit === "distance") {
        return average.toFixed(2) + " km";
      }
      if (unit === "duration") {
        return renderTime(msToObject(average));
      }
      if (unit === "speed") {
        return average.toFixed(2) + " km/h";
      }
      if (unit === "heartRate") {
        return average.toFixed(0) + " bpm";
      }
    }
    return {
      distance: averageDistance,
      duration: averageDuration,
      speed: averageSpeed,
      heartRate: averageHeartRate,
    };
  }

  res.json({
    runData: runs,
    dateArray: dateRange,
    chartData: chartData,
    predictionData: predictionData,
    predictedRun: predictedRun,
    overallStats: overallStats,
    lastUpdated: lastUpdated,
  });
  console.log("Sent most recent run list");
  return;
}

module.exports = {
  launchGet,
};

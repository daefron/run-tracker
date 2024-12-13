import {
  msToObject,
  renderTime,
  toAusDate,
  dateTimeParser,
  compareRuns,
  renderDuration,
  heartRateArrayParse,
} from "./Tools.jsx";
export function runsParser(runs) {
  if (!runs || !runs[0] || !runs[0].heartRateArray) {
    return;
  }
  class Run {
    constructor(run) {
      this.id = run.logId;
      this.date = run.originalStartTime.split("T")[0];
      this.initialTime = dateTimeParser(run.originalStartTime);
      this.duration = msToObject(run.activeDuration);
      this.activeDuration = run.activeDuration;
      this.inactiveDuration = run.duration - run.activeDuration;
      this.distance = Number(run.distance.toFixed(2));
      this.speed = run.speed;
      this.steps = run.steps;
      this.calories = run.calories;
      this.heartRate = run.averageHeartRate;
      this.heartRateZones = run.heartRateZones;
      this.heartRateArray = heartRateArrayParse(run.heartRateArray);
      this.render = {
        date: toAusDate(this.date),
        startTime: renderTime(this.initialTime),
        duration: renderDuration(this.duration),
        distance: this.distance + " km",
        speed: this.speed.toFixed(2) + " km/h",
        heartRate: this.heartRate + " bpm",
      };
    }
  }

  function runMaker() {
    let runHolder = [];
    for (let i = 0; i < runs.length; i++) {
      let run = new Run(runs[i]);
      run.index = i;
      runHolder.push(run);
    }
    runHolder.forEach((run, i) => {
      run.lastRun = runHolder[i + 1];
      if (run.lastRun) {
        compareRuns(run);
      }
    });
    return runHolder;
  }

  return runMaker();
}

import {
  objectToMs,
  msToObject,
  renderTime,
  toAusDate,
  dateTimeParser,
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
      this.heartRateArray = run.heartRateArray;
      for (const value of this.heartRateArray) {
        value.bpm = value.value;
      }
      this.heartRateZones = run.heartRateZones;
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

  return runMaker();

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

  function compareRuns(run) {
    run.render.distanceDiff = compareDistance();
    run.render.durationDiff = compareDuration();

    function compareDistance() {
      let distanceDiff = run.distance - run.lastRun.distance;
      if (distanceDiff < 0) {
        run.distanceNegative = true;
        distanceDiff *= -1;
      }
      let renderDistanceDiff = Number(distanceDiff.toFixed(2));
      if (run.distanceNegative) {
        return "-" + renderDistanceDiff;
      } else {
        return "+" + renderDistanceDiff;
      }
    }

    function compareDuration() {
      let competingTime = objectToMs(run.lastRun.duration);
      let time = objectToMs(run.duration);
      let durationDiff = msToObject(time - competingTime);
      return renderDuration(durationDiff, run);
    }
  }

  function renderDuration(time, run) {
    let negative;
    if (run) {
      negative = diffNegative();
      function diffNegative() {
        let negative;
        for (const type in time) {
          if (time[type] < 0) {
            time[type] *= -1;
            negative = true;
            run.durationNegative = true;
          }
        }
        return negative;
      }
    }
    if (time.secs.toString().length < 2) {
      time.secs = "0" + time.secs;
    }
    let renderString = time.secs;
    if (time.mins) {
      renderString = time.mins + ":" + renderString;
    }
    if (time.hours) {
      renderString = time.hours + ":" + renderString;
    }
    if (run) {
      if (negative) {
        return "-" + renderString;
      }
      return "+" + renderString;
    }
    return renderString;
  }
}

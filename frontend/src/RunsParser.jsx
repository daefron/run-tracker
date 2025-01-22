import {
  msToObject,
  renderTime,
  toAusDate,
  dateTimeParser,
  renderDuration,
  heartRateArrayParse,
  stepsArrayParse,
} from "./Tools.jsx";
export function runsParser(runs) {
  const heartRateZoneNames = ["Light", "Moderate", "Vigorous", "Peak"];
  class Run {
    constructor(run) {
      this.id = run.logId;
      this.duration = run.activeDuration;
      this.totalDuration = run.duration;
      this.inactiveDuration = this.totalDuration - this.duration;
      this.distance = Number(run.distance.toFixed(2));
      this.speed = run.speed;
      this.steps = run.steps;
      this.calories = run.calories;
      this.heartRate = run.averageHeartRate;
      this.heartRateZones = run.heartRateZones;
      this.heartRateZones.forEach((zone, i) => {
        zone.name = heartRateZoneNames[i];
      });
      this.temperature = run.temperature;

      if (run.heartRateArray) {
        this.heartRateArray = heartRateArrayParse(run.heartRateArray);
      }
      if (run.stepsAray) {
        this.stepsArray = stepsArrayParse(run.stepsArray);
      }

      this.render = {
        date: toAusDate(run.originalStartTime),
        startTime: renderTime(dateTimeParser(run.originalStartTime)),
        duration: renderDuration(msToObject(this.duration)),
        distance: this.distance + " km",
        speed: this.speed.toFixed(2) + " km/h",
        steps: this.steps + " steps",
        calories: this.calories + " cals",
        heartRate: this.heartRate + " bpm",
        temperature: this.temperature + " °C",
        GPS: this.GPS,
      };
      if (run.hasGps) {
        this.render.GPS = "Connected";
      } else {
        this.render.GPS = "Disconnected";
      }
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
        function compareRuns(run) {
          run.render.distanceDiff = compareDistance();
          run.render.durationDiff = compareDuration();
          function compareDistance() {
            let distanceDiff = run.distance - run.lastRun.distance;
            if (distanceDiff < 0) {
              run.distanceNegative = true;
              return distanceDiff.toFixed(2);
            }
            return "+" + distanceDiff.toFixed(2);
          }
          function compareDuration() {
            let competingTime = run.lastRun.duration;
            let time = run.duration;
            let durationDiff = time - competingTime;
            if (durationDiff < 0) {
              durationDiff *= -1;
              run.durationNegative = true;
            }
            let renderString = renderDuration(msToObject(durationDiff));
            if (run.durationNegative) {
              return "-" + renderString;
            }
            return "+" + renderString;
          }
        }
      }
    });
    return runHolder;
  }

  return runMaker();
}

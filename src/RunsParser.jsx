import {
  Time,
  objectToMs,
  msToObject,
  renderTime,
  toAusDate,
} from "./Tools.jsx";
import { testData } from "./TestData.jsx";
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
      this.endTime = endTimeCalc(this.initialTime, this.duration);
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
        duration: renderDuration(this.duration, this),
        distance: this.distance + " km",
        speed: this.speed.toFixed(2) + " km/h",
        heartRate: this.heartRate + " bpm",
      };

      function dateTimeParser(dateString) {
        let parsed = dateString.split("T")[1];
        parsed = parsed.split("+")[0].split(":");
        let hour = Number(parsed[0]);
        let mins = Number(parsed[1]);
        let secs = Number(parsed[2]);
        return new Time(hour, mins, secs);
      }
      function endTimeCalc(initialTime, duration) {
        let initialTimeMs = objectToMs(initialTime);
        let durationMs = objectToMs(duration);
        let endTime = msToObject(initialTimeMs + durationMs);
        return endTime;
      }
    }
  }

  let holder = [];
  for (let i = 0; i < runs.length; i++) {
    let newRun = new Run(runs[i]);
    newRun.index = i;
    holder.push(newRun);
  }
  holder.forEach((run) => {
    run.lastRun = holder[run.index + 1];
    if (run.lastRun) {
      let competingDistance = run.lastRun.distance;
      let distance = run.distance;
      run.distanceDiff = distance - competingDistance;
      if (run.distanceDiff < 0) {
        run.distanceNegative = true;
        run.distanceDiff *= -1;
      }
      run.render.distanceDiff = Number(run.distanceDiff.toFixed(2));
      if (run.distanceNegative) {
        run.render.distanceDiff = "-" + run.render.distanceDiff;
      } else {
        run.render.distanceDiff = "+" + run.render.distanceDiff;
      }
      let competingTime = objectToMs(run.lastRun.duration);
      let time = objectToMs(run.duration);
      run.durationDiff = msToObject(time - competingTime);
      run.render.durationDiff = renderDurationDiff(run.durationDiff, run);
    }
    run.nextRun = holder[run.index + 1];
  });
  return holder;

  function renderDurationDiff(time, run) {
    let newTime = new Time(time.hours, time.mins, time.secs);
    let negative;
    for (const type in newTime) {
      if (newTime[type] < 0) {
        newTime[type] *= -1;
        negative = true;
        run.durationNegative = true;
      }
    }
    if (newTime.secs.toString().length < 2) {
      newTime.secs = "0" + newTime.secs;
    }
    let renderString;
    if (newTime.hours === 0 && newTime.mins === 0) {
      renderString = newTime.secs;
    } else if (newTime.hours === 0) {
      renderString = newTime.mins + ":" + newTime.secs;
    } else
      renderString = newTime.hours + ":" + newTime.mins + ":" + newTime.secs;
    if (negative) {
      renderString = "-" + renderString;
    } else {
      renderString = "+" + renderString;
    }
    return renderString;
  }

  function renderDuration(time) {
    let newTime = new Time(time.hours, time.mins, time.secs);
    for (const type in newTime) {
      if (newTime[type] < 0) {
        newTime[type] *= -1;
      }
    }
    if (newTime.secs.toString().length < 2) {
      newTime.secs = "0" + newTime.secs;
    }
    let renderString;
    if (newTime.hours === 0 && newTime.mins === 0) {
      renderString = newTime.secs;
    } else if (newTime.hours === 0) {
      renderString = newTime.mins + ":" + newTime.secs;
    } else
      renderString = newTime.hours + ":" + newTime.mins + ":" + newTime.secs;
    return renderString;
  }
}

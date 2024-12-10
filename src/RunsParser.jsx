import { Time, objectToMs, msToObject } from "./Tools.jsx";
export function runsParser() {
  const testingData = [
    {
      activityName: "Run",
      calories: 265,
      distance: 2.24427,
      distanceUnit: "Kilometer",
      duration: 830000,
      elevationGain: 0,
      originalStartTime: "2024-11-22T11:20:24.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
      logID: 8573498543895,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 1.54427,
      distanceUnit: "Kilometer",
      duration: 650000,
      elevationGain: 0,
      originalStartTime: "2024-11-24T09:10:22.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
      logID: 385763485634234,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 2.94427,
      distanceUnit: "Kilometer",
      duration: 910000,
      elevationGain: 0,
      originalStartTime: "2024-11-27T15:50:58.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
      logID: 45734834324,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 2.45427,
      distanceUnit: "Kilometer",
      duration: 1020000,
      elevationGain: 0,
      originalDuration: 1020000,
      originalStartTime: "2024-11-29T07:30:02.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
      logID: 2354685743,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 2.54427,
      distanceUnit: "Kilometer",
      duration: 920000,
      elevationGain: 0,
      originalDuration: 920000,
      originalStartTime: "2024-12-01T12:30:28.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
      logID: 358797632489234,
    },
  ];

  class Run {
    constructor(run) {
      this.id = run.logID;
      this.date = run.originalStartTime.split("T")[0];
      this.initialTime = dateTimeParser(run.originalStartTime);
      this.duration = msToObject(run.duration);
      this.endTime = endTimeCalc(this.initialTime, this.duration);
      this.distance = Number(run.distance.toFixed(2));
      this.speed = run.speed;
      this.steps = run.steps;
      this.render = {
        date: toAusDate(this.date),
        startTime: renderTime(this.initialTime),
        duration: renderDuration(this.duration, this),
        distance: this.distance + " km",
      };
      function toAusDate(date) {
        let splitDate = date.split("-");
        return (
          splitDate[2] +
          "-" +
          splitDate[1] +
          "-" +
          splitDate[0][2] +
          splitDate[0][3]
        );
      }
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
  for (let i = 0; i !== testingData.length; i++) {
    let newRun = new Run(testingData[i]);
    newRun.index = i;
    holder.push(newRun);
  }
  holder.forEach((run) => {
    run.lastRun = holder[run.index - 1];
    if (run.lastRun) {
      let competingDistance = run.lastRun.distance;
      let distance = run.distance;
      run.distanceDiff = distance - competingDistance;
      if (run.distanceDiff < 0) {
        run.distanceNegative = true;
      }
      run.render.distanceDiff = Number(run.distanceDiff.toFixed(2)) + " km";
      let competingTime = objectToMs(run.lastRun.duration);
      let time = objectToMs(run.duration);
      run.durationDiff = msToObject(time - competingTime);
      run.render.durationDiff = renderDuration(run.durationDiff, run);
    }
    run.nextRun = holder[run.index + 1];
  });
  return holder;

  function renderTime(time) {
    let newTime = [];
    for (const number in time) {
      if (time[number].toString().length < 2) {
        newTime.push("0" + time[number]);
      } else newTime.push(time[number]);
    }
    newTime = new Time(newTime[0], newTime[1], newTime[2]);
    return newTime.hours + ":" + newTime.mins + ":" + newTime.secs;
  }
  function renderDuration(time, run) {
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
    }
    return renderString;
  }
}

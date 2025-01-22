const timeRef = {
  hour: 3600000,
  min: 60000,
  sec: 1000,
};
function msToObject(time) {
  let hours = 0;
  let mins = 0;
  let secs = 0;
  let negative;
  if (time < 0) {
    time *= -1;
    negative = true;
  }
  if (time / timeRef.hour >= 1) {
    hours = time / timeRef.hour;
    let hourRemainder = hours % 1;
    hours -= hourRemainder;
    mins = hourRemainder * 60;
    let minsRemainder = mins % 1;
    mins -= minsRemainder;
    secs = parseInt(minsRemainder * 60);
  } else if (time / timeRef.min >= 1) {
    mins = time / timeRef.min;
    let minsRemainder = mins % 1;
    mins -= minsRemainder;
    secs = parseInt(minsRemainder * 60);
  } else {
    secs = parseInt(time / timeRef.sec);
  }
  if (negative) {
    return new Time(-hours, -mins, -secs);
  }
  return new Time(hours, mins, secs);
}
function Time(hours, mins, secs) {
  this.hours = hours;
  this.mins = mins;
  this.secs = secs;
}
function timeParser(time) {
  const splitTime = time.split(":");
  const hours = Number(splitTime[0]);
  const mins = Number(splitTime[1]);
  const secs = Number(splitTime[2]);
  return hours * timeRef.hour + mins * timeRef.min + secs * timeRef.sec;
}

function heartRateArrayParse(array) {
  const baselineTime = timeParser(array[0].time);
  for (const record of array) {
    record.bpm = record.value;
    let recordTime = timeParser(record.time);
    let difference = msToObject(recordTime - baselineTime);
    record.time = renderTime(difference);
  }
  return array;
}

function renderTime(time) {
  let parsedTime = [];
  for (const number in time) {
    if (time[number].toString().length < 2) {
      parsedTime.push("0" + time[number]);
    } else parsedTime.push(time[number]);
  }
  return parsedTime[0] + ":" + parsedTime[1] + ":" + parsedTime[2];
}
function stepsArrayParse(array) {
  const baselineTime = timeParser(array[0].time);
  for (const record of array) {
    let recordTime = timeParser(record.time);
    let difference = msToObject(recordTime - baselineTime);
    record.time = renderTime(difference);
  }
  return array;
}
function toAusDate(date) {
  let splitDate = date.split("T")[0];
  splitDate = splitDate.split("-");
  return (
    splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0][2] + splitDate[0][3]
  );
}
function renderDuration(time) {
  if (time.secs.toString().length < 2) {
    time.secs = "0" + time.secs;
  }
  let renderString = time.secs;
  if (time.mins) {
    renderString = time.mins + ":" + renderString;
  } else {
    renderString = "0:" + renderString;
  }
  if (time.hours) {
    renderString = time.hours + ":" + renderString;
  }
  return renderString;
}
function dateTimeParser(dateString) {
  let parsed = dateString.split("T")[1];
  parsed = parsed.split("+")[0].split(":");
  let hour = Number(parsed[0]);
  let mins = Number(parsed[1]);
  let secs = Number(parsed[2]);
  return new Time(hour, mins, secs);
}
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
    let durationDiff = run.duration - run.lastRun.duration;
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
const heartRateZoneNames = ["Light", "Moderate", "Vigorous", "Peak"];
class Run {
  constructor(run) {
    this.id = run.logId;
    this.index = run.index;
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

    if (run.heartRateArray) {
      this.heartRateArray = heartRateArrayParse(run.heartRateArray);
    }

    if (run.stepsArray) {
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
      temp: run.temperature + " °C",
      GPS: this.GPS,
    };
    if (run.hasGps) {
      this.render.GPS = "Connected";
    } else {
      this.render.GPS = "Disconnected";
    }
  }
}
module.exports = {
  dateTimeParser,
  renderDuration,
  toAusDate,
  stepsArrayParse,
  renderTime,
  heartRateArrayParse,
  stepsArrayParse,
  msToObject,
  compareRuns,
  Run,
};

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
function trendLine(data, type) {
  let dataSet = data.filter((point) => point.id);
  const xData = dataSet.map((point) => point.order);
  const yData = dataSet.map((point) => point[type]);
  const xMean = getAverage(xData);
  const yMean = getAverage(yData);
  const xMinusxMean = xData.map((value) => value - xMean);
  const yMinusyMean = yData.map((value) => value - yMean);
  const xMinusxMeanSq = xMinusxMean.map((val) => Math.pow(val, 2));
  const xy = [];
  for (let x = 0; x < dataSet.length; x++) {
    xy.push(xMinusxMean[x] * yMinusyMean[x]);
  }
  const xySum = getTotal(xy);
  const slope = xySum / getTotal(xMinusxMeanSq);
  const slopeStart = yMean - slope * xMean;
  return {
    slope: slope,
    slopeStart: slopeStart,
    calcY: (x) => slopeStart + slope * x,
    xStart: xData[0],
    xEnd: xData[xData.length - 1],
  };
}
function dateFiller(runs, dateRange, types) {
  let dateHolder = [];
  for (let i = 0; i <= dateRange.length - 1; i++) {
    let runOnDate = runs.find((run) => run.render.date === dateRange[i]);
    let stats = {
      date: dateRange[i][0] + dateRange[i][1],
      order: i,
      parsedDate: dateRange[i],
    };
    if (runOnDate) {
      runOnDate.chartOrder = i;
      stats.id = runOnDate.id;
      types.forEach((type) => {
        stats[type] = runOnDate[type];
      });
    }
    dateHolder.push(stats);
  }
  return dateHolder;
}
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
    this.originalStartTime = run.originalStartTime;
    this.calories = run.calories;
    this.heartRate = run.averageHeartRate;
    this.heartRateZones = run.heartRateZones;
    const heartRateZoneNames = ["Light", "Moderate", "Vigorous", "Peak"];
    this.heartRateZones.forEach((zone, i) => {
      zone.name = heartRateZoneNames[i];
    });
    this.render = {
      date: toAusDate(this.originalStartTime),
      startTime: renderTime(dateTimeParser(this.originalStartTime)),
      duration: renderDuration(msToObject(this.duration)),
      distance: this.distance + " km",
      speed: this.speed.toFixed(2) + " km/h",
      steps: this.steps + " steps",
      calories: this.calories + " cals",
      heartRate: this.heartRate + " bpm",
      temp: run.temperature + " °C",
    };
    if (run.hasGps) {
      this.render.GPS = "Connected";
    } else {
      this.render.GPS = "Disconnected";
    }
    this.heartRateLink = run.heartRateLink;
  }
  temp(temp) {
    this.temp = temp;
  }
  heartRateArray(array) {
    this.heartRateArray = heartRateArrayParse(array);
  }
  stepsArray(array) {
    this.stepsArray = stepsArrayParse(array);
  }
}
function dateArray(runs, gap) {
  if (!gap) {
    gap = 0;
  }
  const lowestDate = renderToDate(runs[runs.length - 1].render.date);
  const highestDate = renderToDate(runs[0].render.date);
  const amountOfDays = gap + (highestDate - lowestDate) / 86400000;
  let array = [];
  let currentDate = lowestDate;
  for (let i = 0; i <= amountOfDays; i++) {
    array.push(dateToRender(currentDate));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return array;
}
function dateToRender(date) {
  let day = date.getDate().toString();
  if (day.length < 2) {
    day = "0" + day;
  }
  let month = (date.getMonth() + 1).toString();
  if (month.length < 2) {
    month = "0" + month;
  }
  const year = date.getFullYear().toString();
  return day + "/" + month + "/" + year[2] + year[3];
}
function renderToDate(date) {
  const newDay = Number(date.split("/")[0]);
  const newMonth = Number(date.split("/")[1] - 1);
  const newYear = Number("20" + date.split("/")[2]);
  return new Date(newYear, newMonth, newDay);
}
function getTotal(data) {
  if (data[0] === undefined) {
    return;
  }
  return data.reduce((total, value) => total + value);
}
function getAverage(data) {
  if (data[0] === undefined) {
    return;
  }
  const dataTotal = data.reduce((total, value) => total + value);
  return dataTotal / data.length;
}
class PredictedRun {
  constructor(runs) {
    const types = [
      "duration",
      "distance",
      "speed",
      "heartRate",
      "steps",
      "calories",
    ];
    const filledDates = dateFiller(runs, dateArray(runs), types);
    this.id = "nextRun";
    this.gap = getGapsAverage();
    this.chartOrder = runs[0].chartOrder + this.gap;
    typeMaker(this);
    this.render = {
      date: dateToRender(getPredictedDate(this)),
      distance: this.distance.toFixed(2) + " km",
      duration: renderDuration(msToObject(this.duration)),
      speed: this.speed.toFixed(2) + " km/h",
      heartRate: Math.round(this.heartRate) + " bpm",
      steps: Math.round(this.steps) + " steps",
      calories: Math.round(this.calories) + " cals",
    };

    function getGapsAverage() {
      let gaps = [];
      runs.forEach((value, i) => {
        if (i > 0) {
          gaps.push(runs[i - 1].chartOrder - value.chartOrder);
        }
      });
      return Math.round(getAverage(gaps));
    }

    function getPredictedDate(parent) {
      let lastDate = renderToDate(runs[0].render.date);
      lastDate.setDate(lastDate.getDate() + parent.gap);
      return lastDate;
    }

    function typeMaker(parent) {
      types.forEach((type) => {
        parent[type] = trendLine(filledDates, type).calcY(parent.chartOrder);
      });
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
  getTotal,
  getAverage,
  msToObject,
  compareRuns,
  dateArray,
  trendLine,
  dateFiller,
  Run,
  PredictedRun,
};

function Time(hours, mins, secs) {
  this.hours = hours;
  this.mins = mins;
  this.secs = secs;
}

export function objectToMs(time) {
  const hourIn = 3600000;
  const minIn = 60000;
  const secIn = 1000;
  return time.hours * hourIn + time.mins * minIn + time.secs * secIn;
}

export function msToObject(time) {
  const hourIn = 3600000;
  const minIn = 60000;
  const secsIn = 1000;
  let hours = 0;
  let mins = 0;
  let secs = 0;
  let negative;
  if (time < 0) {
    time *= -1;
    negative = true;
  }
  if (time / hourIn >= 1) {
    hours = time / hourIn;
    let hourRemainder = hours % 1;
    hours -= hourRemainder;
    mins = hourRemainder * 60;
    let minsRemainder = mins % 1;
    mins -= minsRemainder;
    secs = parseInt(minsRemainder * 60);
  } else if (time / minIn >= 1) {
    mins = time / minIn;
    let minsRemainder = mins % 1;
    mins -= minsRemainder;
    secs = parseInt(minsRemainder * 60);
  } else {
    secs = parseInt(time / secsIn);
  }
  if (negative) {
    return new Time(-hours, -mins, -secs);
  }
  return new Time(hours, mins, secs);
}

export function renderTime(time) {
  let parsedTime = [];
  for (const number in time) {
    if (time[number].toString().length < 2) {
      parsedTime.push("0" + time[number]);
    } else parsedTime.push(time[number]);
  }
  return parsedTime[0] + ":" + parsedTime[1] + ":" + parsedTime[2];
}

export function toAusDate(date) {
  let splitDate = date.split("-");
  return (
    splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0][2] + splitDate[0][3]
  );
}

export function daysBeforeToRender(daysBefore, date) {
  const currentDay = date.getDate();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const newDate = new Date(currentYear, currentMonth, currentDay - daysBefore);
  const newDay = newDate.getDate().toString();
  const newMonth = (newDate.getMonth() + 1).toString();
  const newYear = newDate.getFullYear().toString();
  return newDay + "/" + newMonth + "/" + newYear[2] + newYear[3];
}

export function dateArrayToRender(length, baselineDate, marginAmount) {
  const currentDay = baselineDate.current.getDate();
  const currentMonth = baselineDate.current.getMonth();
  const currentYear = baselineDate.current.getFullYear();
  let days = [];
  for (let i = length - marginAmount.current; i >= -marginAmount.current; i--) {
    let newDate = new Date(currentYear, currentMonth, currentDay - i);
    let day = newDate.getDate().toString();
    if (day.length < 2) {
      day = "0" + day;
    }
    let month = (newDate.getMonth() + 1).toString();
    if (month.length < 2) {
      month = "0" + month;
    }
    let year = newDate.getFullYear().toString();
    days.push(day + "/" + month + "/" + year[2] + year[3]);
  }
  return days;
}

export function dateTimeParser(dateString) {
  let parsed = dateString.split("T")[1];
  parsed = parsed.split("+")[0].split(":");
  let hour = Number(parsed[0]);
  let mins = Number(parsed[1]);
  let secs = Number(parsed[2]);
  return new Time(hour, mins, secs);
}

export function compareRuns(run) {
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

export function renderDuration(time) {
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
  return renderString;
}

function timeParser(time) {
  let parsed = time.split(":");
  let hours = Number(parsed[0]);
  let mins = Number(parsed[1]);
  let secs = Number(parsed[2]);
  let parsedTime = {
    hours: hours,
    mins: mins,
    secs: secs,
  };
  return objectToMs(parsedTime);
}

export function heartRateArrayParse(array) {
  const baselineTime = timeParser(array[0].time);
  for (const record of array) {
    record.bpm = record.value;
    let recordTime = timeParser(record.time);
    let difference = msToObject(recordTime - baselineTime);
    record.time = renderTime(difference);
  }
  return array;
}

export function getAverage(data) {
  if (!data[0]) {
    return;
  }
  const dataTotal = data.reduce((total, value) => total + value);
  return dataTotal / data.length;
}

export function getTotal(data) {
  if (!data[0]) {
    return;
  }
  return data.reduce((total, value) => total + value);
}

export function gapsBetween(data, type) {
  let gaps = [];
  data.forEach((value, i) => {
    if (i > 0) {
      gaps.push(value[type] - data[i - 1][type]);
    }
  });
  return gaps;
}

export function trendLine(data, type) {
  let dataSet = data.filter((point) => point.id);
  if (type === "heartRate") {
    dataSet = dataSet.filter((point) => point.heartRate);
  }
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
    xStart: xData[0] - 1,
    xEnd: xData[xData.length - 1],
  };
}

export function dateFiller(runs, dateRange, types) {
  let holder = [];
  let lastHR;
  for (let i = dateRange.length - 1; i > 0; i--) {
    let runOnDate = runs.find((run) => run.render.date === dateRange[i]);
    if (runOnDate) {
      runOnDate.chartOrder = i;
      let stats = {
        id: runOnDate.id,
        date: dateRange[i][0] + dateRange[i][1],
        order: i,
        parsedDate: dateRange[i],
      };
      types.forEach((type) => {
        if (type === "heartRate" && !runOnDate.heartRate) {
          stats[type] = lastHR;
        } else if (type === "heartRate" && runOnDate.heartRate) {
          lastHR = runOnDate.heartRate;
          stats[type] = runOnDate[type];
        } else {
          stats[type] = runOnDate[type];
        }
      });
      holder.push(stats);
    } else {
      holder.push({
        id: null,
        date: dateRange[i][0] + dateRange[i][1],
        order: i,
        parsedDate: dateRange[i],
      });
    }
  }
  let holder2 = [];
  for (let i = holder.length - 1; i >= 0; i--) {
    holder2.push(holder[i]);
  }
  return holder2;
}

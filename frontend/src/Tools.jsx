function Time(hours, mins, secs) {
  this.hours = hours;
  this.mins = mins;
  this.secs = secs;
}
//time in ms
const timeRef = {
  hour: 3600000,
  min: 60000,
  sec: 1000,
};

export function objectToMs(time) {
  return (
    time.hours * timeRef.hour +
    time.mins * timeRef.min +
    time.secs * timeRef.sec
  );
}

export function msToObject(time) {
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
  let splitDate = date.split("T")[0];
  splitDate = splitDate.split("-");
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

export function renderDuration(time) {
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

function timeParser(time) {
  const splitTime = time.split(":");
  const hours = Number(splitTime[0]);
  const mins = Number(splitTime[1]);
  const secs = Number(splitTime[2]);
  return hours * timeRef.hour + mins * timeRef.min + secs * timeRef.sec;
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

export function stepsArrayParse(array) {
  const baselineTime = timeParser(array[0].time);
  for (const record of array) {
    let recordTime = timeParser(record.time);
    let difference = msToObject(recordTime - baselineTime);
    record.time = renderTime(difference);
  }
  return array;
}

export function getAverage(data) {
  if (data[0] === undefined) {
    return;
  }
  const dataTotal = data.reduce((total, value) => total + value);
  return dataTotal / data.length;
}

export function getTotal(data) {
  if (data[0] === undefined) {
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
export function dateArray(runs) {
  const lowestDate = runs[runs.length - 1].render.date;
  const lowestDay = Number(lowestDate.split("/")[0]);
  const lowestMonth = Number(lowestDate.split("/")[1] - 1);
  const lowestYear = Number("20" + lowestDate.split("/")[2]);
  const lowestDateParsed = new Date(lowestYear, lowestMonth, lowestDay);
  const highestDate = runs[0].render.date;
  const highestDay = Number(highestDate.split("/")[0]);
  const highestMonth = Number(highestDate.split("/")[1] - 1);
  const highestYear = Number("20" + highestDate.split("/")[2]);
  const highestDateParsed = new Date(highestYear, highestMonth, highestDay);
  const amountOfDays = 5 + (highestDateParsed - lowestDateParsed) / 86400000;
  let array = [];
  let currentDate = lowestDateParsed;
  for (let i = 0; i <= amountOfDays; i++) {
    let day = currentDate.getDate().toString();
    if (day.length < 2) {
      day = "0" + day;
    }
    let month = (currentDate.getMonth() + 1).toString();
    if (month.length < 2) {
      month = "0" + month;
    }
    const year = currentDate.getFullYear().toString();
    const renderDate = day + "/" + month + "/" + year[2] + year[3];
    array.push(renderDate);
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return array;
}

export function arrayReverser(array) {
  let reversedArray = [];
  for (let i = array.length - 1; i >= 0; i--) {
    reversedArray.push(array[i]);
  }
  return reversedArray;
}

export function dateFiller(runs, dateRange, types) {
  let holder = [];
  for (let i = dateRange.length - 1; i >= 0; i--) {
    let runOnDate = runs.find((run) => run.render.date === dateRange[i]);
    if (runOnDate) {
      holder.push(runOnDateStats());
    } else {
      holder.push(noRunOnDateStats());
    }
    function runOnDateStats() {
      runOnDate.chartOrder = i;
      let stats = {
        id: runOnDate.id,
        date: dateRange[i][0] + dateRange[i][1],
        order: i,
        parsedDate: dateRange[i],
      };
      types.forEach((type) => {
        stats[type] = runOnDate[type];
      });
      return stats;
    }
    function noRunOnDateStats() {
      return {
        id: null,
        date: dateRange[i][0] + dateRange[i][1],
        order: i,
        parsedDate: dateRange[i],
      };
    }
  }
  return arrayReverser(holder);
}

export function initialLines() {
  const types = ["duration", "distance", "speed", "heartRate", "temperature"];
  let visibleLines = {};
  types.forEach((type) => (visibleLines[type] = true));
  return visibleLines;
}

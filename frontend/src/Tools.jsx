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

export function getAverage(data) {
  if (data[0] === undefined) {
    return;
  }
  return getTotal(data) / data.length;
}

export function getTotal(data) {
  if (data[0] === undefined) {
    return;
  }
  return data.reduce((total, value) => total + value);
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
  const lowestDate = renderToDate(runs[runs.length - 1].render.date);
  const highestDate = renderToDate(runs[0].render.date);
  const amountOfDays = 5 + (highestDate - lowestDate) / 86400000;
  let array = [];
  let currentDate = lowestDate;
  for (let i = 0; i <= amountOfDays; i++) {
    array.push(dateToRender(currentDate));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return array;

  function renderToDate(date) {
    const newDay = Number(date.split("/")[0]);
    const newMonth = Number(date.split("/")[1] - 1);
    const newYear = Number("20" + date.split("/")[2]);
    return new Date(newYear, newMonth, newDay);
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
}

export function dateFiller(runs, dateRange, types) {
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

export function initialLines() {
  const types = ["duration", "distance", "heartRate"];
  let visibleLines = {};
  types.forEach((type) => (visibleLines[type] = true));
  return visibleLines;
}

export function Time(hours, mins, secs) {
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
  if (time < 0) {
    time *= -1;
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
  return new Time(hours, mins, secs);
}

export function msToChart(initialTime) {
  let time = msToObject(initialTime);
  if (time.secs.toString().length < 2) {
    time.secs = "0" + time.secs;
  }
  let renderString = time.mins + ":" + time.secs;
  if (time.hours) {
    renderString = time.hours + ":" + renderString;
  }
  return renderString;
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

export function dateArrayToRender(length, baselineDate) {
  const currentDay = baselineDate.current.getDate();
  const currentMonth = baselineDate.current.getMonth();
  const currentYear = baselineDate.current.getFullYear();
  let days = [];
  for (let i = length; i >= 0; i--) {
    const newDate = new Date(currentYear, currentMonth, currentDay - i);
    let date = {
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    };
    for (const type in date) {
      date[type] = date[type].toString();
      if (date[type].length < 2) {
        date[type] = "0" + date[type];
      }
    }
    days.push(date.day + "/" + date.month + "/" + date.year[2] + date.year[3]);
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

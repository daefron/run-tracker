export function Time(hours, mins, secs) {
  this.hours = hours;
  this.mins = mins;
  this.secs = secs;
}

export function objectToMs(time) {
  let total = 0;
  let hourIn = 3600000;
  let minIn = 60000;
  let secIn = 1000;
  total += time.hours * hourIn;
  total += time.mins * minIn;
  total += time.secs * secIn;
  return total;
}

export function msToObject(time) {
  let hourIn = 3600000;
  let minIn = 60000;
  let secsIn = 1000;
  if (time < 0) {
    hourIn = -3600000;
    minIn = -60000;
    secsIn = -1000;
  }
  let hours = 0;
  let mins = 0;
  let secs = 0;
  if (time / hourIn >= 1) {
    hours = time / hourIn;
    let hourRemainder = hours % 1;
    hours -= hourRemainder;
    mins = hourRemainder * 60;
    let minsRemainder = mins % 1;
    mins -= minsRemainder;
    secs = parseInt(minsRemainder * 60);
    if (time > 0) {
      return new Time(hours, mins, secs);
    }
    return new Time(-hours, -mins, -secs);
  }
  if (time / minIn >= 1) {
    mins = time / minIn;
    let minsRemainder = mins % 1;
    mins -= minsRemainder;
    secs = parseInt(minsRemainder * 60);
    if (time > 0) {
      return new Time(hours, mins, secs);
    }
    return new Time(-hours, -mins, -secs);
  }
  secs = parseInt(time / secsIn);
  if (time > 0) {
    return new Time(hours, mins, secs);
  }
  return new Time(-hours, -mins, -secs);
}

export function msToChart(initialTime) {
  let time = msToObject(initialTime);
  let newTime = new Time(time.hours, time.mins, time.secs);
  if (newTime.secs.toString().length < 2) {
    newTime.secs = "0" + newTime.secs;
  }
  let renderString;
  if (newTime.hours === 0) {
    renderString = newTime.mins + ":" + newTime.secs;
  } else renderString = newTime.hours + ":" + newTime.mins + ":" + newTime.secs;
  return renderString;
}

export function toAusDate(date) {
  let splitDate = date.split("-");
  return (
    splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0][2] + splitDate[0][3]
  );
}

export function dateArrayToRender(length, baselineDate) {
  let days = [];
  const currentDay = baselineDate.current.getDate();
  const currentMonth = baselineDate.current.getMonth();
  const currentYear = baselineDate.current.getFullYear();
  for (let i = length; i >= 0; i--) {
    let newDay = new Date(currentYear, currentMonth, currentDay - i);
    days.push(newDay);
  }
  let holder = [];
  days.forEach((date) => {
    let separatedDate = dateParser(date);
    separatedDate[1] += 1;
    let holder2 = [];
    separatedDate.forEach((digit) => {
      if (digit.toString().length < 2) {
        digit = "0" + digit;
      } else digit = digit.toString();
      holder2.push(digit);
    });
    let parsedDate =
      holder2[0] + "/" + holder2[1] + "/" + holder2[2][2] + holder2[2][3];
    holder.push(parsedDate);
  });
  return holder;

  function dateParser(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return [day, month, year];
  }
}

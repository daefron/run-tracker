import {
  trendLine,
  dateFiller,
  getAverage,
  gapsBetween,
  msToObject,
  renderDuration,
} from "../Tools";
export class PredictedRun {
  constructor(dateRange, runs) {
    if (!runs) {
      return;
    }
    const types = [
      "duration",
      "distance",
      "speed",
      "heartRate",
      "steps",
      "calories",
      "temperature",
    ];
    this.id = "nextRun";
    const filledDates = dateFiller(runs, dateRange, types);
    const gap = getGapsAverage();
    this.gap = gap;
    this.chartOrder = orderGetter();
    const daysBefore = dateRange.length - 1 - this.chartOrder;
    let lastDate = new Date();
    lastDate.setDate(lastDate.getDate() + 4);
    this.date = daysBeforeToData(daysBefore, lastDate);
    typeMaker(this);
    this.render = {
      date: dateToRender(this.date),
      distance: this.distance.toFixed(2) + " km",
      duration: renderDuration(msToObject(this.duration)),
      speed: this.speed.toFixed(2) + " km/h",
      heartRate: Math.round(this.heartRate) + " bpm",
      steps: Math.round(this.steps) + " steps",
      calories: Math.round(this.calories) + " cals",
      temperate: this.temperature + " °C",
    };

    function daysBeforeToData(daysBefore, date) {
      const currentDay = date.getDate();
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();
      return new Date(currentYear, currentMonth, currentDay - daysBefore);
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

    function getGapsAverage() {
      filledDates.forEach((point, i) => {
        point.order = i;
      });
      let dataSet = filledDates.filter((point) => point.id);
      return Math.round(getAverage(gapsBetween(dataSet, "order")));
    }

    function orderGetter() {
      for (let i = filledDates.length - 1; i > 0; i--) {
        if (filledDates[i].id) {
          return filledDates[i].order + gap;
        }
      }
    }
    function typeMaker(parent) {
      types.forEach((type) => {
        parent[type] = trendLine(filledDates, type).calcY(parent.chartOrder);
      });
    }
  }
}

import {
  trendLine,
  dateFiller,
  getAverage,
  gapsBetween,
  msToObject,
  renderDuration,
  dateArrayToRender,
} from "../Tools";
export class PredictedRun {
  constructor(baselineDate, dateRange, runs, marginAmount, setDateRange) {
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
    ];
    this.id = "nextRun";
    const dateRuns = dateFiller(runs, dateRange, types);
    const gap = getGapsAverage();
    this.gap = gap;
    this.chartOrder = orderGetter();
    const daysBefore = dateRuns.length - 1 - this.chartOrder;
    this.date = daysBeforeToData(daysBefore, baselineDate.current);
    typeMaker(this);
    this.render = {
      date: dateToRender(this.date),
      distance: this.distance.toFixed(2) + " km",
      duration: renderDuration(msToObject(this.duration)),
      speed: this.speed.toFixed(2) + " km/h",
      heartRate: Math.round(this.heartRate) + " bpm",
      steps: Math.round(this.steps) + " steps",
      calories: Math.round(this.calories) + " cals",
    };

    if (this.date > baselineDate.current) {
      marginAmount.current = this.gap;
      setDateRange(dateArrayToRender(31, baselineDate, marginAmount));
    }

    function daysBeforeToData(daysBefore, date) {
      const currentDay = date.getDate();
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();
      return new Date(currentYear, currentMonth, currentDay - daysBefore);
    }

    function dateToRender(date) {
      const day = date.getDate().toString();
      const month = (date.getMonth() + 1).toString();
      const year = date.getFullYear().toString();
      return day + "/" + month + "/" + year[2] + year[3];
    }

    function getGapsAverage() {
      dateRuns.forEach((point, i) => {
        point.order = i;
      });
      let dataSet = dateRuns.filter((point) => point.id);
      return Math.round(getAverage(gapsBetween(dataSet, "order")));
    }

    function orderGetter() {
      for (let i = dateRuns.length - 1; i > 0; i--) {
        if (dateRuns[i].id) {
          return dateRuns[i].order + gap;
        }
      }
    }

    function typeMaker(parent) {
      types.forEach((type) => {
        parent[type] = trendLine(dateRuns, type).calcY(parent.chartOrder);
      });
    }
  }
}

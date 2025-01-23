import {
  trendLine,
  dateFiller,
  getAverage,
  msToObject,
  renderDuration,
  renderToDate,
  dateToRender,
} from "../Tools";
export class PredictedRun {
  constructor(dateRange, runs) {
    const types = [
      "duration",
      "distance",
      "speed",
      "heartRate",
      "steps",
      "calories",
    ];
    const filledDates = dateFiller(runs, dateRange, types);
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

import {
  trendLine,
  dateFiller,
  getAverage,
  gapsBetween,
  msToObject,
  daysBeforeToRender,
  renderDuration,
} from "../Tools";
export class PredictedRun {
  constructor(baselineDate, dateRange, runs, types) {
    this.id = "nextRun";
    const dateRuns = dateFiller(runs, dateRange, types);
    const gap = getGapsAverage();
    this.gap = gap;
    this.chartOrder = orderGetter();
    const daysBefore = dateRuns.length - 1 - this.chartOrder;
    this.date = daysBeforeToRender(daysBefore, baselineDate.current);
    typeMaker(this);
    this.render = {
      date: daysBeforeToRender(daysBefore, baselineDate.current),
      distance: this.distance.toFixed(2) + " km",
      duration: renderDuration(msToObject(this.duration)),
      speed: this.speed.toFixed(2) + " km/h",
      heartRate: Math.round(this.heartRate) + " bpm",
      steps: Math.round(this.steps) + " steps",
      calories: Math.round(this.calories) + " cals",
    };
    function getGapsAverage() {
      dateRuns.forEach((point, i) => {
        point.order = i;
      });
      let dataSet = dateRuns.filter((point) => point.id);
      return getAverage(gapsBetween(dataSet, "order"));
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

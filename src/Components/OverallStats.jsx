import {
  msToObject,
  objectToMs,
  renderTime,
  getAverage,
  getTotal,
} from "../Tools";
export function OverallStats(props) {
  if (!props.runs) {
    return;
  }

  function Average(props) {
    let average = findAverage();
    let averageRender = average.toFixed(props.decimals) + props.render;
    if (props.unit === "duration") {
      averageRender = renderTime(msToObject(average));
    }
    return (
      <div className="runStat" id={"average" + props.unit}>
        <p className="statTitle">Average {props.name}: </p>
        <p className="statContent">{averageRender}</p>
      </div>
    );

    function findAverage() {
      let all = props.runs.map((run) => run[props.unit]);
      if (props.unit === "duration") {
        all.forEach((unit, i) => (all[i] = unit));
      }
      return getAverage(all);
    }
  }

  function Total(props) {
    let total = findTotal();
    let totalRender = total + props.render;
    if (props.unit === "distance") {
      totalRender = total.toFixed(2) + props.render;
    } else if (props.unit === "duration") {
      totalRender = renderTime(msToObject(total));
    }
    return (
      <div className="runStat" id={"average" + props.unit}>
        <p className="statTitle">Total {props.unit}: </p>
        <p className="statContent">{totalRender}</p>
      </div>
    );

    function findTotal() {
      let all = props.runs.map((run) => run[props.unit]);
      if (props.unit === "duration") {
        all.forEach((unit, i) => (all[i] = unit));
      } else if (props.unit === "runs") {
        all.forEach((unit, i) => (all[i] = 1));
      }
      return getTotal(all);
    }
  }

  function Find({ runs, unit, type }) {
    let target = findTarget();
    let findRender = target.render.date + " - " + target.render[unit];
    if (unit === "speed") {
      findRender =
        target.render.date + " - " + target.speed.toFixed(2) + " km/h";
    }
    return (
      <div className="runStat" id={"find" + unit}>
        <p className="statTitle">
          {type} {unit}:
        </p>
        <p className="statContent">{findRender}</p>
      </div>
    );
    function findTarget() {
      let target = { [unit]: 0 };
      if (type === "Lowest") {
        target[unit] = Infinity;
      }
      for (let i = 0; i < runs.length; i++) {
        let compareGreater = runs[i][unit];
        let compareLesser = target[unit];
        if (type === "Lowest") {
          compareGreater = target[unit];
          compareLesser = runs[i][unit];
        }
        if (compareGreater > compareLesser) {
          target = runs[i];
        }
      }
      return target;
    }
  }

  return (
    <div id="overallStats">
      <p id="overallStatsTitle">Overall stats</p>
      <Total runs={props.runs} unit="runs" render="" />
      <Total runs={props.runs} unit="distance" render=" km" />
      <Average
        runs={props.runs}
        unit="distance"
        name="distance"
        decimals={2}
        render=" km"
      />
      <Find runs={props.runs} unit="distance" type="Highest" />
      <Find runs={props.runs} unit="distance" type="Lowest" />
      <Total runs={props.runs} unit="duration" render="" />
      <Average runs={props.runs} unit="duration" name="duration" render="" />
      <Find runs={props.runs} unit="duration" type="Highest" />
      <Find runs={props.runs} unit="duration" type="Lowest" />
      <Average
        runs={props.runs}
        unit="speed"
        name="speed"
        decimals={2}
        render=" km/h"
      />
      <Find runs={props.runs} unit="speed" type="Highest" />
      <Find runs={props.runs} unit="speed" type="Lowest" />
      <Average
        runs={props.runs}
        unit="heartRate"
        name="heart rate"
        decimals={0}
        render=" bpm"
      />
    </div>
  );
}

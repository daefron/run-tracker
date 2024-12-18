import { msToObject, renderTime, getAverage, getTotal } from "../Tools";
export function OverallStats({ runs }) {
  function Average({ decimals, render, unit, name }) {
    let average = findAverage();
    let averageRender = average.toFixed(decimals) + render;
    if (unit === "duration") {
      averageRender = renderTime(msToObject(average));
    }
    return (
      <div className="listItem" id={"average" + unit}>
        <p className="statTitle smallFont">Average {name}: </p>
        <p className="statContent smallFont">{averageRender}</p>
      </div>
    );

    function findAverage() {
      let all = runs.map((run) => run[unit]);
      if (unit === "duration") {
        all.forEach((unit, i) => (all[i] = unit));
      }
      return getAverage(all);
    }
  }

  function Total({ render, unit }) {
    let total = findTotal();
    let totalRender = total + render;
    if (unit === "distance") {
      totalRender = total.toFixed(2) + render;
    } else if (unit === "duration") {
      totalRender = renderTime(msToObject(total));
    }
    return (
      <div className="listItem" id={"average" + unit}>
        <p className="statTitle smallFont">Total {unit}: </p>
        <p className="statContent smallFont">{totalRender}</p>
      </div>
    );

    function findTotal() {
      let all = runs.map((run) => run[unit]);
      if (unit === "duration") {
        all.forEach((unit, i) => (all[i] = unit));
      } else if (unit === "runs") {
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
      <div className="listItem" id={"find" + unit}>
        <p className="statTitle smallFont">
          {type} {unit}:
        </p>
        <p className="statContent smallFont">{findRender}</p>
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
      <p id="overallStatsTitle" className="titleFont elementHeader">
        Overall stats
      </p>
      <Total runs={runs} unit="runs" render="" />
      <Total runs={runs} unit="distance" render=" km" />
      <Average
        runs={runs}
        unit="distance"
        name="distance"
        decimals={2}
        render=" km"
      />
      <Find runs={runs} unit="distance" type="Highest" />
      <Total runs={runs} unit="duration" render="" />
      <Average runs={runs} unit="duration" name="duration" render="" />
      <Find runs={runs} unit="duration" type="Highest" />
      <Average
        runs={runs}
        unit="speed"
        name="speed"
        decimals={2}
        render=" km/h"
      />
      <Find runs={runs} unit="speed" type="Highest" />
      <Average
        runs={runs}
        unit="heartRate"
        name="heart rate"
        decimals={0}
        render=" bpm"
      />
    </div>
  );
}

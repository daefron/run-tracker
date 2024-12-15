import { msToObject, objectToMs, renderTime, getAverage, getTotal } from "../Tools";
export function Average(props) {
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
      all.forEach((unit, i) => (all[i] = objectToMs(unit)));
    }
    return getAverage(all);
  }
}

export function Total(props) {
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
      all.forEach((unit, i) => (all[i] = objectToMs(unit)));
    } else if (props.unit === "runs") {
      all.forEach((unit, i) => (all[i] = 1));
    }
    return getTotal(all);
  }
}

export function Find(props) {
  let target = findTarget();
  let findRender = target.render.date + " - " + target.render[props.unit];
  if (props.unit === "speed") {
    findRender = target.render.date + " - " + target.speed.toFixed(2) + " km/h";
  }
  return (
    <div className="runStat" id={"find" + props.unit}>
      <p className="statTitle">
        {props.type} {props.unit}:
      </p>
      <p className="statContent">{findRender}</p>
    </div>
  );

  function findTarget() {
    let all = props.runs;
    let targetBaseline = 0;
    if (props.type === "Lowest") {
      targetBaseline = Infinity;
    }
    let target = { [props.unit]: targetBaseline };
    for (let i = 0; i < all.length; i++) {
      let ifType =
        objectToMs(all[i][props.unit]) > objectToMs(target[props.unit]);
      let ifDuration = all[i][props.unit] > target[props.unit];
      if (props.type === "Lowest") {
        ifType =
          objectToMs(all[i][props.unit]) < objectToMs(target[props.unit]);
        ifDuration = all[i][props.unit] < target[props.unit];
      }
      if (props.unit === "duration") {
        if (ifType || !objectToMs(target[props.unit])) {
          target = all[i];
        }
      } else {
        if (ifDuration) {
          target = all[i];
        }
      }
    }
    return target;
  }
}

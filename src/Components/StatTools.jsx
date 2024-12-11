import { msToObject, objectToMs, renderTime } from "../Tools";
export function Average(props) {
  let all = props.runs.map((run) => run[props.unit]);
  let total = 0;
  for (const unit of all) {
    if (props.unit === "duration") {
      total += objectToMs(unit);
    } else {
      total += unit;
    }
  }
  let average = total / all.length;
  let averageRender = average.toFixed(2) + props.render;
  if (props.unit === "duration") {
    averageRender = renderTime(msToObject(average));
  }
  return (
    <div className="runStat" id={"average" + props.unit}>
      <p className="statTitle">Average {props.unit}: </p>
      <p className="statContent">{averageRender}</p>
    </div>
  );
}

export function Total(props) {
  let all = props.runs.map((run) => run[props.unit]);
  let total = 0;
  for (const unit of all) {
    if (props.unit === "duration") {
      total += objectToMs(unit);
    } else if (props.unit === "runs") {
      total++;
    } else {
      total += unit;
    }
  }
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
}

export function Find(props) {
  let target;
  let all = props.runs;
  if (props.type === "Highest") {
    target = { [props.unit]: 0 };
    for (let i = 0; i < all.length; i++) {
      if (props.unit === "duration") {
        if (
          objectToMs(all[i][props.unit]) > objectToMs(target[props.unit]) ||
          !objectToMs(target[props.unit])
        ) {
          target = all[i];
        }
      } else {
        if (all[i][props.unit] > target[props.unit]) {
          target = all[i];
        }
      }
    }
  } else if (props.type === "Lowest") {
    target = { [props.unit]: Infinity };
    for (let i = 0; i < all.length; i++) {
      if (props.unit === "duration") {
        if (
          objectToMs(all[i][props.unit]) < objectToMs(target[props.unit]) ||
          !objectToMs(target[props.unit])
        ) {
          target = all[i];
        }
      } else {
        if (all[i][props.unit] < target[props.unit]) {
          target = all[i];
        }
      }
    }
  }
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
}

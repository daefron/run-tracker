import { Total, Average, Find } from "./StatTools.jsx";
export function OverallStats(props) {
  if (!props.runs) {
    return;
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

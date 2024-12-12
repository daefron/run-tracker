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
      <Average runs={props.runs} unit="distance" render=" km" />
      <Find runs={props.runs} unit="distance" type="Highest" />
      <Find runs={props.runs} unit="distance" type="Lowest" />
      <Total runs={props.runs} unit="duration" render="" />
      <Average runs={props.runs} unit="duration" render="" />
      <Find runs={props.runs} unit="duration" type="Highest" />
      <Find runs={props.runs} unit="duration" type="Lowest" />
      <Average runs={props.runs} unit="speed" render=" km/h" />
      <Find runs={props.runs} unit="speed" type="Highest" />
      <Find runs={props.runs} unit="speed" type="Lowest" />
    </div>
  );
}

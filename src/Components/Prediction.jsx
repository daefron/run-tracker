import { objectToMs, msToObject } from "../Tools";
export function Prediction(props) {
  // let sortedRuns = [];
  // for (let i = props.runs.length - 1; i >= 0; i--) {
  //   sortedRuns.push(props.runs[i]);
  // }
  // let durations = [];
  // let lengths = [];
  // let bpms = [];
  // sortedRuns.forEach((run) => {
  //   durations.push(objectToMs(run.duration));
  //   lengths.push(run.distance);
  //   bpms.push(run.heartRate);
  // });
  // let durationGaps = [];
  // durations.forEach((duration, i) => {
  //   if (!i) {
  //     return;
  //   }
  //   durationGaps.push(duration - durations[i - 1]);
  // });
  // let totalDurationGaps = durationGaps.reduce((total, value) => total + value);
  // let averageDurationGap = totalDurationGaps / durationGaps.length;

  return <div id="prediction"></div>;
}

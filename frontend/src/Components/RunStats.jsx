import { Stats } from "./Generic/Stats.jsx";
export function RunStats({ runs, activeRun }) {
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
    "temperature",
    "GPS",
  ];
  const run = runs[activeRun];
  return (
    <div id="runStats">
      <p id="runStatsTitle" className="elementHeader titleFont">
        Selected run stats
      </p>
      <div className="listItem">
        <p className="statTitle smallFont">Date: </p>
        <p className="statContent smallFont">{run.render.date}</p>
      </div>
      <div className="listItem">
        <p className="statTitle smallFont">Start time: </p>
        <p className="statContent smallFont">{run.render.startTime}</p>
      </div>
      <Stats run={run} types={types} />
    </div>
  );
}

import { PredictedRun } from "./PredictedRun";
export function PredictionStats(props) {
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "steps",
    "calories",
  ];
  const nextRun = new PredictedRun(props, types);
  return (
    <div id="prediction">
      <p id="runStatsTitle">Predicted next run stats</p>
      {types.map((type) => {
        return (
          <div key={type} className="runStat">
            <p className="statTitle">
              {type.charAt(0).toUpperCase() + type.slice(1)}:
            </p>
            <p className="statContent">{nextRun.render[type]}</p>
          </div>
        );
      })}
    </div>
  );
}

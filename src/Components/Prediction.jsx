import { PredictedRun } from "./PredictedRun";
import { Stats } from "./Generic/Stats";
import { CheckMark } from "./Generic/CheckMark";
export function PredictionStats(props) {
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "steps",
    "calories",
  ];
  const nextRun = new PredictedRun(
    props.baselineDate,
    props.dateRange,
    props.runs,
    types
  );
  return (
    <div id="predictionStats">
      <p id="runStatsTitle">Predicted next run stats</p>
      <div className="runStat">
        <p className="statTitle">Date: </p>
        <p className="statContent">
          {nextRun.render.date} ({nextRun.gap} days from last run )
        </p>
      </div>
      <Stats run={nextRun} types={types} />
      <div className="statsFooter">
        <CheckMark
          type="prediction"
          text="show on graph"
          class="statsFooter"
          checked="checked"
          state={props.predictedOnGraph}
          setState={props.setPredictedOnGraph}
        />
        <CheckMark
          type="trendline"
          text="show trendline on graph"
          class="statsFooter"
          checked="checked"
          state={props.trendlineOnGraph}
          setState={props.setTrendlineOnGraph}
        />
      </div>
    </div>
  );
}

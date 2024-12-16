import { Stats } from "./Generic/Stats";
import { CheckMark } from "./Generic/CheckMark";
export function PredictionStats(props) {
  if (!props.runs || !props.predictedRuns) {
    return;
  }
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "calories",
    "steps",
  ];
  return (
    <div id="predictionStats">
      <p id="runStatsTitle">Predicted next run stats</p>
      <div className="runStat">
        <p className="statTitle">Date: </p>
        <p className="statContent">
          {props.predictedRuns[0].render.date} ({props.predictedRuns[0].gap}{" "}
          days from last run )
        </p>
      </div>
      <Stats run={props.predictedRuns[0]} types={types} />
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

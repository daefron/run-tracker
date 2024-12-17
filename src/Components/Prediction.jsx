import { Stats } from "./Generic/Stats";
import { CheckMark } from "./Generic/CheckMark";
export function PredictionStats({
  predictedRuns,
  predictedOnGraph,
  setPredictedOnGraph,
  trendlineOnGraph,
  setTrendlineOnGraph,
}) {
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
      <p id="runStatsTitle" className="titleFont">
        Predicted next run stats
      </p>
      <div className="runStat">
        <p className="statTitle smallFont">Date: </p>
        <p className="statContent smallFont">
          {predictedRuns[0].render.date} ({predictedRuns[0].gap} days from last
          run )
        </p>
      </div>
      <Stats run={predictedRuns[0]} types={types} />
      <div className="statsFooter">
        <CheckMark
          type="prediction"
          text="show on graph"
          classRender="statsFooter"
          checked="checked"
          state={predictedOnGraph}
          setState={setPredictedOnGraph}
        />
        <CheckMark
          type="trendline"
          text="show trendline on graph"
          classRender="statsFooter"
          checked="checked"
          state={trendlineOnGraph}
          setState={setTrendlineOnGraph}
        />
      </div>
    </div>
  );
}

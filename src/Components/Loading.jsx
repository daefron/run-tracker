import { PulseLoader } from "react-spinners";
export function Loading() {
  return (
    <div id="loadingHolder">
      <div id="loadingTextHolder">
        <p id="loadingText">Fetching Fitbit data</p>
        <PulseLoader id="loadingSymbol" size={5} color="white" />
      </div>
      <div id="loadingBody" style={{ filter: "blur(10px)" }}>
        <div id="allRunsGraph">
          <div className="graphTop">
            <p className="graphTitle">All runs</p>
          </div>
        </div>
        <div id="predictionStats">
          <p id="runStatsTitle">Predicted next run stats</p>
          <div className="runStat">
            <p className="statTitle">Date: </p>
            <p className="statContent"></p>
          </div>
          <div className="statsFooter"></div>
        </div>
        <div id="selectedGraph">
          <div className="graphTop">
            <p className="graphTitle">Selected run</p>
          </div>
        </div>
        <div id="runStats">
          <p id="runStatsTitle">Selected run stats</p>
        </div>
        <div id="overallStats">
          <p id="overallStatsTitle">Overall stats</p>
        </div>
        <div id="runList">
          <div id="listTitle">
            <p>Date</p>
            <p>Start Time</p>
            <p>Duration</p>
            <p>Length</p>
          </div>
        </div>
        <div id="activeTimePie">
          <div className="graphTop">
            <p className="graphTitle">Heart zone minutes</p>
          </div>
        </div>
        <div id="heartZonesPie">
          <div className="graphTop">
            <p className="graphTitle">Active time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

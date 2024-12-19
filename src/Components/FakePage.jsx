export function FakePage() {
  return (
    <div id="fakeBody" style={{ filter: "blur(10px)" }}>
      <div id="allRunsGraph" className="graphHolder">
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
      <div id="selectedGraph" className="graphHolder">
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
      <div id="activeTimePie" className="pieHolder">
        <div className="graphTop">
          <p className="graphTitle">Heart zone minutes</p>
        </div>
      </div>
      <div id="heartZonesPie" className="pieHolder">
        <div className="graphTop">
          <p className="graphTitle">Active time</p>
        </div>
      </div>
    </div>
  );
}

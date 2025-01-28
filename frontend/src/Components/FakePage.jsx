import { CheckMark } from "./Generic/CheckMark";
export function FakePage() {
  return (
    <div id="fakeBody" style={{ filter: "blur(10px)" }}>
      <div id="allRunsGraph" className="graphHolder">
        <div className="elementHeader">
          <p className="graphTitle titleFont">All runs</p>
        </div>
      </div>
      <div id="predictionStats" style={{ height: "450px" }}>
        <p className="titleFont elementHeader">Predicted next run stats</p>
        <div className="statsFooter">
          <CheckMark
            type="prediction"
            text="show on graph"
            classRender="statsFooter"
            checked="checked"
          />
          <CheckMark
            type="trendline"
            text="show trendline on graph"
            classRender="statsFooter"
            checked="checked"
          />
        </div>
      </div>
      <div id="selectedGraph" className="graphHolder">
        <div className="elementHeader">
          <p className="titleFont">Selected run</p>
        </div>
      </div>
      <div id="runStats">
        <p id="runStatsTitle" className="titleFont elementHeader">
          Selected run stats
        </p>
      </div>
      <div id="overallStats">
        <p id="overallStatsTitle" className="titleFont elementHeader">
          Overall stats
        </p>
      </div>
      <div id="runList" style={{ height: "450px" }}>
        <div className="elementHeader runItem runListTitle">
          <p className="titleFont" style={{ width: "5%" }}>
            GPS
          </p>
          <p className="titleFont" style={{ width: "20%" }}>
            Date
          </p>
          <p className="titleFont" style={{ width: "20%" }}>
            Start Time
          </p>
          <p className="titleFont" style={{ width: "30%" }}>
            Duration
          </p>
          <p className="titleFont" style={{ width: "30%" }}>
            Length &nbsp; &nbsp; &nbsp;
          </p>
        </div>
      </div>
      <div id="activeTimePie" className="pieHolder">
        <div className="elementHeader">
          <p className="titleFont">Heart Zone Minutes</p>
        </div>
      </div>
      <div id="heartZonesPie" className="pieHolder">
        <div className="elementHeader">
          <p className="titleFont">Time Active</p>
        </div>
      </div>
      <div id="lastUpdated" style={{ display: "flex", gap: 5 }}>
        <svg width="18" height="20" viewBox="0 -960 960 960" fill="white">
          <path d="M480-160q-134 0-227-93t-93-227 93-227 227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170 70 170 170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67" />
        </svg>
        <p className="smallFont">Last updated: 0 minutes ago</p>
      </div>
    </div>
  );
}

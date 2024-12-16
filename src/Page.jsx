import { useState, useRef, useEffect } from "react";
import { runsParser } from "./RunsParser.jsx";
import { dateArrayToRender } from "./Tools.jsx";
import { RunList } from "./Components/RunList.jsx";
import { PredictionStats } from "./Components/Prediction.jsx";
import { ChartLine } from "./Components/ChartLine.jsx";
import { ChartPie } from "./Components/ChartPie.jsx";
import { OverallStats } from "./Components/OverallStats.jsx";
import { RunStats } from "./Components/RunStats.jsx";
import PulseLoader from "react-spinners/PulseLoader.js";
import "./App.css";
import { PredictedRun } from "./Components/PredictedRun.jsx";
export function Page(props) {
  const [parsedRuns, setParsedRuns] = useState(runsParser(props.runs));
  useEffect(() => {
    setParsedRuns(runsParser(props.runs));
  }, [props.runs]);
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  const baselineDate = useRef(new Date());
  const marginAmount = useRef(0);
  const dateRangeChange = useRef(31);
  const [dateRange, setDateRange] = useState(
    dateArrayToRender(31, baselineDate, marginAmount)
  );
  const [predictedOnGraph, setPredictedOnGraph] = useState(true);
  const [trendlineOnGraph, setTrendlineOnGraph] = useState(true);
  const [predictedRuns, setPredictedRuns] = useState([
    new PredictedRun(
      baselineDate,
      dateRange,
      parsedRuns,
      marginAmount,
      setDateRange
    ),
  ]);
  if (props.loading) {
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
  return (
    <>
      <div id="body">
        <RunList
          runs={parsedRuns}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
          hoverRun={hoverRun}
          setHoverRun={setHoverRun}
        />
        <PredictionStats
          runs={parsedRuns}
          dateRange={dateRange}
          setDateRange={setDateRange}
          baselineDate={baselineDate}
          predictedOnGraph={predictedOnGraph}
          setPredictedOnGraph={setPredictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          setTrendlineOnGraph={setTrendlineOnGraph}
          marginAmount={marginAmount}
          predictedRuns={predictedRuns}
        />
        <ChartLine
          render="Selected run"
          type="selected"
          runs={parsedRuns}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setActiveRun={setActiveRun}
          predictedOnGraph={predictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          predictedRuns={predictedRuns}
          marginAmount={marginAmount}
        />
        <ChartLine
          render="All runs"
          type="allRuns"
          durationColor="rgb(100, 149, 237)"
          distanceColor="rgb(195, 177, 146)"
          heartRateColor="rgb(220, 20, 60)"
          speedColor="rgb(250, 128, 114)"
          runs={parsedRuns}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setActiveRun={setActiveRun}
          predictedOnGraph={predictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          predictedRuns={predictedRuns}
          marginAmount={marginAmount}
        />
        <ChartPie
          render="Heart zone minutes"
          type="heartZones"
          runs={parsedRuns}
          activeRun={activeRun}
        />
        <ChartPie
          render="Active time"
          type="activeTime"
          runs={parsedRuns}
          activeRun={activeRun}
        />
        <RunStats runs={parsedRuns} activeRun={activeRun} />
        <OverallStats runs={parsedRuns} />
      </div>
    </>
  );
}

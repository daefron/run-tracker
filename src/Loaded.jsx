import { useState, useRef, useEffect } from "react";
import { runsParser } from "./RunsParser.jsx";
import { dateArrayToRender } from "./Tools.jsx";
import { RunList } from "./Components/RunList.jsx";
import { PredictionStats } from "./Components/Prediction.jsx";
import { AllChart } from "./Components/AllChart.jsx";
import { SelectedChart } from "./Components/SelectedChart.jsx";
import { ChartPie } from "./Components/ChartPie.jsx";
import { OverallStats } from "./Components/OverallStats.jsx";
import { RunStats } from "./Components/RunStats.jsx";
import { PredictedRun } from "./Components/PredictedRun.jsx";
export function Loaded(props) {
  const [parsedRuns, setParsedRuns] = useState(runsParser(props.runs));
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
          predictedRuns={predictedRuns}
          predictedOnGraph={predictedOnGraph}
          setPredictedOnGraph={setPredictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          setTrendlineOnGraph={setTrendlineOnGraph}
        />
        <SelectedChart
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
        <AllChart
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

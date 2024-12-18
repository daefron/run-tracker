import { useState, useRef } from "react";
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
export function Loaded({ runs }) {
  const parsedRuns = useRef(runsParser(runs));
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  const baselineDate = useRef(new Date());
  const marginAmount = useRef(0);
  const dateRangeChange = useRef(31);
  const [dateRange, setDateRange] = useState(
    dateArrayToRender(dateRangeChange.current, baselineDate, marginAmount)
  );
  const [predictedOnGraph, setPredictedOnGraph] = useState(true);
  const [trendlineOnGraph, setTrendlineOnGraph] = useState(true);
  const predictedRuns = useRef([
    new PredictedRun(
      baselineDate,
      dateRange,
      parsedRuns.current,
      marginAmount,
      setDateRange,
      dateRangeChange
    ),
  ]);
  return (
    <>
      <div id="body">
        <RunList
          runs={parsedRuns.current}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
          hoverRun={hoverRun}
          setHoverRun={setHoverRun}
        />
        <PredictionStats
          predictedRuns={predictedRuns.current}
          predictedOnGraph={predictedOnGraph}
          setPredictedOnGraph={setPredictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          setTrendlineOnGraph={setTrendlineOnGraph}
        />
        <SelectedChart
          render="Selected run"
          runs={parsedRuns.current}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
        />
        <AllChart
          render="All runs"
          durationColor="rgb(100, 149, 237)"
          distanceColor="rgb(195, 177, 146)"
          heartRateColor="rgb(220, 20, 60)"
          speedColor="rgb(250, 128, 114)"
          runs={parsedRuns.current}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          predictedOnGraph={predictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          predictedRuns={predictedRuns.current}
          marginAmount={marginAmount}
        />
        <ChartPie
          render="Heart zone time"
          type="heartZones"
          runs={parsedRuns.current}
          activeRun={activeRun}
        />
        <ChartPie
          render="Active time"
          type="activeTime"
          runs={parsedRuns.current}
          activeRun={activeRun}
        />
        <RunStats runs={parsedRuns.current} activeRun={activeRun} />
        <OverallStats runs={parsedRuns.current} />
      </div>
    </>
  );
}

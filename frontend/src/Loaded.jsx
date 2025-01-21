import { useState, useRef } from "react";
import { runsParser } from "./RunsParser.jsx";
import { dateArrayToRender, initialLines } from "./Tools.jsx";
import { RunList } from "./Components/RunList.jsx";
import { PredictionStats } from "./Components/Prediction.jsx";
import { AllChart } from "./Components/AllChart.jsx";
import { SelectedChart } from "./Components/SelectedChart.jsx";
import { ChartPie } from "./Components/ChartPie.jsx";
import { OverallStats } from "./Components/OverallStats.jsx";
import { RunStats } from "./Components/RunStats.jsx";
import { PredictedRun } from "./Components/PredictedRun.jsx";
import { LastUpdated } from "./Components/LastUpdated.jsx";

export function Loaded({ runs, lastUpdated, setLoading, setLastUpdated }) {
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
  const [lineVisibility, setLineVisibility] = useState(initialLines());
  const lineColors = {
    duration: "rgb(0, 200, 150)",
    distance: "rgb(0, 80, 255)",
    heartRate: "rgb(210, 0, 0)",
    speed: "rgb(220, 0, 100)",
    steps: "rgb(200, 200, 200)",
    calories: "rgb(255, 150, 0)",
    temperature: "rgb(200, 200, 0)",
  };
  const [selectedType, setSelectedType] = useState("bpm");
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
          render="Selected run - "
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          runs={parsedRuns.current}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
        />
        <AllChart
          render="All runs"
          lineColors={lineColors}
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
          lineVisibility={lineVisibility}
          setLineVisibility={setLineVisibility}
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
        <LastUpdated
          lastUpdated={lastUpdated}
          setLoading={setLoading}
          setLastUpdated={setLastUpdated}
        />
      </div>
    </>
  );
}

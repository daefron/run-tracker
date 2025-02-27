import { useState } from "react";
import { RunList } from "./Components/RunList.jsx";
import { PredictionStats } from "./Components/Prediction.jsx";
import { AllChart } from "./Components/AllChart.jsx";
import { SelectedChart } from "./Components/SelectedChart.jsx";
import { ChartPie } from "./Components/ChartPie.jsx";
import { OverallStats } from "./Components/OverallStats.jsx";
import { RunStats } from "./Components/RunStats.jsx";
import { LastUpdated } from "./Components/LastUpdated.jsx";
export function Loaded({ data, setLoading, setLastUpdated }) {
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  const [predictedOnGraph, setPredictedOnGraph] = useState(true);
  const [trendlineOnGraph, setTrendlineOnGraph] = useState(true);
  const [brushStart, setBrushStart] = useState(0);
  const [brushEnd, setBrushEnd] = useState(data.chartData.length - 1);
  const [lineVisibility, setLineVisibility] = useState({
    duration: true,
    distance: true,
    heartRate: true,
  });
  const [selectedType, setSelectedType] = useState("bpm");
  return (
    <>
      <div id="body">
        <RunList
          runs={data.runData}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
          hoverRun={hoverRun}
          setHoverRun={setHoverRun}
          brushStart={brushStart}
          setBrushStart={setBrushStart}
          brushEnd={brushEnd}
          setBrushEnd={setBrushEnd}
        />
        <PredictionStats
          predictedRuns={data.predictedRun}
          predictedOnGraph={predictedOnGraph}
          setPredictedOnGraph={setPredictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          setTrendlineOnGraph={setTrendlineOnGraph}
        />
        <SelectedChart
          render="Selected run - "
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
          runs={data.runData}
        />
        <AllChart
          render="All runs"
          activeRun={activeRun}
          predictedOnGraph={predictedOnGraph}
          trendlineOnGraph={trendlineOnGraph}
          lineVisibility={lineVisibility}
          setLineVisibility={setLineVisibility}
          brushStart={brushStart}
          setBrushStart={setBrushStart}
          brushEnd={brushEnd}
          setBrushEnd={setBrushEnd}
          runs={data.runData}
          predictedRuns={data.predictedRun}
          chartData={data.chartData}
          predictionData={data.predictionData}
          trends={data.trends}
        />
        <ChartPie
          render="Heart rate zones"
          type="heartZones"
          run={data.runData[activeRun]}
        />
        <ChartPie
          render="Active time"
          type="activeTime"
          run={data.runData[activeRun]}
        />
        <RunStats run={data.runData[activeRun]} />
        <OverallStats overallStats={data.overallStats} />
        <LastUpdated
          lastUpdated={data.lastUpdated}
          setLoading={setLoading}
          setLastUpdated={setLastUpdated}
        />
      </div>
    </>
  );
}

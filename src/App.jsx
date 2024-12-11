import { useState, useRef } from "react";
import { runsParser } from "./RunsParser.jsx";
import { msToChart, dateArrayToRender } from "./Tools.jsx";
import { RunList } from "./Components/RunList.jsx";
import { ChartLine } from "./Components/ChartLine.jsx";
import { OverallStats } from "./Components/OverallStats.jsx";
import { RunStats } from "./Components/RunStats.jsx";
import { apiCall } from "./APICaller.jsx";
import "./App.css";
export default function Page() {
  const runsRef = useRef(runsParser());
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  const baselineDate = useRef(new Date());
  const dateRangeChange = useRef(31);
  const [dateRange, setDateRange] = useState(
    dateArrayToRender(31, baselineDate)
  );
  return (
    <>
      <div id="body">
        <RunList
          runs={runsRef.current}
          activeRun={activeRun}
          setActiveRun={setActiveRun}
          hoverRun={hoverRun}
          setHoverRun={setHoverRun}
        />
        <ChartLine
          render="Selected run"
          type="selected"
          runs={runsRef.current}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <ChartLine
          render="All runs"
          type="allRuns"
          durationColor="orange"
          distanceColor="yellow"
          runs={runsRef.current}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <RunStats runs={runsRef.current} activeRun={activeRun} />
        <OverallStats runs={runsRef.current} />
      </div>
    </>
  );
}

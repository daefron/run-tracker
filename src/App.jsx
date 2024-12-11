import { useState, useRef } from "react";
import { runsParser } from "./RunsParser.jsx";
import { dateArrayToRender } from "./Tools.jsx";
import { RunList } from "./Components/RunList.jsx";
import { ChartLine } from "./Components/ChartLine.jsx";
import { ChartPie } from "./Components/ChartPie.jsx";
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
          durationColor="cornflowerBlue"
          distanceColor="khaki"
          heartRateColor="crimson"
          speedColor="salmon"
          runs={runsRef.current}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <ChartPie
          render="Heart zone minutes"
          type="heartZones"
          runs={runsRef.current}
          activeRun={activeRun}
        />
        <ChartPie
          render="Active time"
          type="activeTime"
          runs={runsRef.current}
          activeRun={activeRun}
        />
        <RunStats runs={runsRef.current} activeRun={activeRun} />
        <OverallStats runs={runsRef.current} />
      </div>
    </>
  );
}

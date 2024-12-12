import { useState, useRef, useEffect } from "react";
import { runsParser } from "./RunsParser.jsx";
import { dateArrayToRender } from "./Tools.jsx";
import { RunList } from "./Components/RunList.jsx";
import { ChartLine } from "./Components/ChartLine.jsx";
import { ChartPie } from "./Components/ChartPie.jsx";
import { OverallStats } from "./Components/OverallStats.jsx";
import { RunStats } from "./Components/RunStats.jsx";
import PulseLoader from "react-spinners/PulseLoader.js";
import "./App.css";
export function Page(props) {
  const [parsedRuns, setParsedRuns] = useState(runsParser(props.runs));
  useEffect(() => {
    setParsedRuns(runsParser(props.runs));
  }, [props.runs]);
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  const baselineDate = useRef(new Date());
  const dateRangeChange = useRef(31);
  const [dateRange, setDateRange] = useState(
    dateArrayToRender(31, baselineDate)
  );
  if (props.loading) {
    return <div id="loadingHolder">
      <p id="loadingText">Fetching Fitbit data</p>
      <PulseLoader id="loadingSymbol" size={5} color="white"/>
      </div>
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
        <ChartLine
          render="Selected run"
          type="selected"
          runs={parsedRuns}
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
          runs={parsedRuns}
          activeRun={activeRun}
          baselineDate={baselineDate}
          dateRangeChange={dateRangeChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
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

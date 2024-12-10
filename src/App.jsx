import { useState, useRef } from "react";
import { ChartLine } from "./Components/ChartLine.jsx";
import { runsParser } from "./RunsParser.jsx";
import { msToChart } from "./Tools.jsx";
import { RunListTitle } from "./Components/RunListTitle.jsx";
import { RunList } from "./Components/RunList.jsx";
import { AllRuns } from "./Components/AllRuns.jsx";
import "./App.css";
export default function Page() {
  const runsRef = useRef(runsParser());
  const [activeRun, setActiveRun] = useState(0);
  return (
    <>
      <div id="body">
        <div id="left">
          <RunListTitle></RunListTitle>
          <RunList
            runs={runsRef.current}
            activeRun={activeRun}
            setActiveRun={setActiveRun}
          ></RunList>
          {/* <AllRuns */}
            {/* activeRun={activeRun} */}
            {/* setActiveRun={setActiveRun} */}
          {/* ></AllRuns> */}
        </div>
        <div id="right">
          <ChartLine
            xAxis="date"
            yAxis="duration"
            yAxisFormatter={msToChart}
            runs={runsRef.current}
            activeRun={activeRun}
          ></ChartLine>
          <ChartLine
            xAxis="date"
            yAxis="distance"
            yAxisUnit=" km"
            runs={runsRef.current}
            activeRun={activeRun}
            ></ChartLine>
        </div>
      </div>
    </>
  );
}

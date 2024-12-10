import { useState, useRef } from "react";
import { ChartLine } from "./Components/ChartLine.jsx";
import { runsParser } from "./RunsParser.jsx";
import { msToChart } from "./Tools.jsx";
import { RunListTitle } from "./Components/RunListTitle.jsx";
import { RunList } from "./Components/RunList.jsx";
import "./App.css";
export default function Page() {
  const runsRef = useRef(runsParser());
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  return (
    <>
      <div id="body">
        <div id="left">
          <RunListTitle></RunListTitle>
          <RunList
            runs={runsRef.current}
            activeRun={activeRun}
            setActiveRun={setActiveRun}
            hoverRun={hoverRun}
            setHoverRun={setHoverRun}
          ></RunList>
        </div>
        <div id="right">
          <div className="graphHolder" id="durationGraph">
            <p className="graphTitle">Duration</p>
            <ChartLine
              xAxis="date"
              yAxis="duration"
              yAxisFormatter={msToChart}
              lineColor="green"
              runs={runsRef.current}
              activeRun={activeRun}
            ></ChartLine>
          </div>
          <div className="graphHolder" id="distanceGraph">
            <p className="graphTitle">Distance</p>
            <ChartLine
              xAxis="date"
              yAxis="distance"
              yAxisUnit=" km"
              lineColor="yellow"
              runs={runsRef.current}
              activeRun={activeRun}
            ></ChartLine>
          </div>
        </div>
      </div>
    </>
  );
}

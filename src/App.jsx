import { useState, useRef } from "react";
import { runsParser } from "./RunsParser.jsx";
import { msToChart , dateArrayToRender} from "./Tools.jsx";
import { ChartLine } from "./Components/ChartLine.jsx";
import { RunListTitle } from "./Components/RunListTitle.jsx";
import { RunList } from "./Components/RunList.jsx";
import "./App.css";
export default function Page() {
  const runsRef = useRef(runsParser());
  const [activeRun, setActiveRun] = useState(0);
  const [hoverRun, setHoverRun] = useState(0);
  const baselineDate = useRef(new Date());
  const dateRangeChange = useRef(31);
  const [dateRange, setDateRange] = useState(dateArrayToRender(31, baselineDate));

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
          <ChartLine
            render="Duration"
            xAxis="date"
            yAxis="duration"
            yAxisFormatter={msToChart}
            lineColor="green"
            runs={runsRef.current}
            activeRun={activeRun}
            baselineDate={baselineDate}
            dateRangeChange={dateRangeChange}
            dateRange={dateRange}
            setDateRange={setDateRange}
          ></ChartLine>
          <ChartLine
            render="Date"
            xAxis="date"
            yAxis="distance"
            yAxisUnit=" km"
            lineColor="yellow"
            runs={runsRef.current}
            activeRun={activeRun}
            baselineDate={baselineDate}
            dateRangeChange={dateRangeChange}
            dateRange={dateRange}
            setDateRange={setDateRange}
          ></ChartLine>
        </div>
      </div>
    </>
  );
}

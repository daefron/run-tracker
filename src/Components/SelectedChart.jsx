import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  Legend,
  ReferenceLine,
  Tooltip,
  YAxis,
} from "recharts";
export function SelectedChart({ runs, activeRun, render, setActiveRun }) {
  if (!runs) {
    return;
  }
  function gridMaker(dimension, divider) {
    let array = [];
    for (let i = 0; i < dimension; i += dimension / divider) {
      array.push(i);
    }
    return array;
  }
  function TooltipContent({ payload }) {
    if (payload[0]) {
      return (
        <>
          <p>Time: {payload[0].payload.time}</p>
          <p>BPM: {payload[0].payload.bpm}</p>
        </>
      );
    }
  }
  function SmallerLegend(payload) {
    let data = payload.payload.filter((value) => value.type !== "none");
    const listStyle = {
      display: "flex",
      justifyContent: "center",
      gap: "35px",
      margin: 0,
    };
    return (
      <ul style={listStyle}>
        {data.map((entry, index) => (
          <li
            key={"item-" + index}
            style={{ color: entry.color, fontSize: 15, textIndent: -8 }}
          >
            {entry.value.charAt(0).toLowerCase() + entry.value.slice(1)}
          </li>
        ))}
      </ul>
    );
  }
  if (runs[activeRun].heartRateZones) {
    const chartData = bpmChartData(runs[activeRun].heartRateArray);
    const zones = zoneGetter(runs[activeRun].heartRateZones);
    function zoneGetter(data) {
      let parsedData = {};
      data.forEach((value) => {
        parsedData[value.name] = value.min;
      });
      return parsedData;
    }
    function bpmChartData(chartData) {
      let zones = runs[activeRun].heartRateZones;
      let holder = [];
      chartData.forEach((entry) => {
        for (const zone of zones) {
          if (entry.bpm >= zone.min && entry.bpm <= zone.max) {
            entry[zone.name] = entry.bpm;
          }
        }
        holder.push(entry);
      });
      holder.forEach((entry, i) => {
        if (holder[i + 1]) {
          let nextEntry = holder[i + 1];
          let entryKey = Object.keys(entry)[3];
          let nextEntryKey = Object.keys(nextEntry)[3];
          if (entryKey !== nextEntryKey) {
            entry[nextEntryKey] = entry.value;
          }
        }
        if (holder[i - 1]) {
          let previousEntry = holder[i - 1];
          let entryKey = Object.keys(entry)[3];
          let previousEntryKey = Object.keys(previousEntry)[3];
          if (entryKey !== previousEntryKey) {
            entry[previousEntryKey] = entry.value;
          }
        }
      });
      return holder;
    }
    function ActiveRunShiftButton({ value, render, activeRun, runs }) {
      return (
        <p
          onClick={() => {
            activeRunShiftButton(value);
          }}
          className="smallFont"
          style={
            (value === "right" && !activeRun) ||
            (value === "left" && !runs[activeRun + 1])
              ? {
                  color: "dimGrey",
                }
              : {
                  color: "white",
                  cursor: "pointer",
                }
          }
        >
          {render}
        </p>
      );
    }
    function activeRunShiftButton(direction) {
      if (direction === "right" && activeRun) {
        setActiveRun(activeRun - 1);
      } else if (direction === "left" && runs[activeRun + 1]) {
        setActiveRun(activeRun + 1);
      }
    }
    return (
      <div className="graphHolder" id={"selectedGraph"}>
        <div className="graphTop">
          <p className="graphTitle titleFont">{render}</p>
          <div className="graphDateHolder">
            <ActiveRunShiftButton
              value="left"
              render="<-"
              activeRun={activeRun}
              runs={runs}
            />
            <p className="smallFont">{runs[activeRun].render.date}</p>
            <ActiveRunShiftButton
              value="right"
              render="->"
              activeRun={activeRun}
              runs={runs}
            />
          </div>
        </div>
        <ResponsiveContainer>
          <LineChart margin={{ top: 20, left:10, right: 20, bottom: 10 }} data={chartData}>
            <CartesianGrid
              stroke="rgba(255, 255, 255, 0.1)"
              x={35}
              horizontalCoordinatesGenerator={({ height }) =>
                gridMaker(height - 6 , 15)
              }
              verticalCoordinatesGenerator={({ width }) => gridMaker(width - 5, 15)}
            />
            <YAxis yAxisId="bpm" width={25} />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Light"
              stroke="hotPink"
              strokeWidth={2}
              legendType="circle"
              dot={false}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Moderate"
              stroke="green"
              strokeWidth={2}
              legendType="circle"
              dot={false}
            />
            <ReferenceLine
              yAxisId="bpm"
              strokeWidth={1}
              stroke="green"
              y={zones.Moderate}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Vigorous"
              stroke="yellow"
              strokeWidth={2}
              legendType="circle"
              dot={false}
            />
            <ReferenceLine
              yAxisId="bpm"
              strokeWidth={1}
              stroke="yellow"
              y={zones.Vigorous}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Peak"
              stroke="red"
              strokeWidth={2}
              legendType="circle"
              dot={false}
            />
            <ReferenceLine
              yAxisId="bpm"
              strokeWidth={1}
              stroke="red"
              y={zones.Peak}
            />
            <Legend content={<SmallerLegend />} />
            <Tooltip content={<TooltipContent />} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return (
      <div className="graphHolder" id={"selectedGraph"}>
        <div className="graphTop">
          <p className="graphTitle">{render}</p>
          <div className="graphDateHolder"></div>
        </div>
        <p className="noData">No data available for manual records</p>
      </div>
    );
  }
}

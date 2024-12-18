import {
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
  Tooltip,
  YAxis,
} from "recharts";
export function SelectedChart({ runs, activeRun, render, setActiveRun }) {
  function TooltipContent({ payload }) {
    if (payload[0]) {
      return (
        <>
          <p className="smallFont">Time: {payload[0].payload.time}</p>
          <p className="smallFont">BPM: {payload[0].payload.bpm}</p>
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
            className="recharts-legend-item-text smallFont"
            style={{ color: entry.color }}
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
    function SmallerAxisTick({ payload, x, y }) {
      return (
        <g transform={"translate(" + x + "," + y + ")"}>
          <text
            dx={0}
            dy={5}
            textAnchor="end"
            fill="white"
            className="smallFont"
          >
            {payload.value}
          </text>
        </g>
      );
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
    const lineColors = {
      peakPercentage: lineColor("Peak"),
      vigorousPercentage: lineColor("Vigorous"),
      moderatePercentage: lineColor("Moderate"),
    };
    function lineColor(type) {
      let highest = highestValue(chartData);
      let lowest = lowestValue(chartData);
      console.log(lowest);
      let percentageOf =
        (1 - (zones[type] - lowest) / (highest - lowest)) * 100;
      console.log(percentageOf);
      return percentageOf + "%";
    }
    function highestValue(array) {
      let bpmArray = array.map((value) => (value = value.bpm));
      let highest = 0;
      for (let i = 0; i <= bpmArray.length; i++) {
        if (bpmArray[i] > highest) {
          highest = bpmArray[i];
        }
      }
      return highest;
    }
    function lowestValue(array) {
      let bpmArray = array.map((value) => (value = value.bpm));
      let lowest = Infinity;
      for (let i = 0; i <= bpmArray.length; i++) {
        if (bpmArray[i] < lowest) {
          lowest = bpmArray[i];
        }
      }
      return lowest;
    }
    return (
      <div className="graphHolder" id={"selectedGraph"}>
        <div className="elementHeader">
          <p className="titleFont">{render}</p>
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
          <LineChart
            margin={{ top: 10, left: 10, right: 20, bottom: 10 }}
            data={chartData}
          >
            <YAxis
              yAxisId="bpm"
              width={25}
              tick={<SmallerAxisTick />}
              tickCount={3}
              domain={["dataMin", "dataMax"]}
            />

            <defs>
              <linearGradient id="colorBpm" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="red" />
                <stop offset={lineColors.peakPercentage} stopColor="red" />
                <stop offset={lineColors.peakPercentage} stopColor="yellow" />
                <stop
                  offset={lineColors.vigorousPercentage}
                  stopColor="yellow"
                />
                <stop
                  offset={lineColors.vigorousPercentage}
                  stopColor="green"
                />
                <stop
                  offset={lineColors.moderatePercentage}
                  stopColor="green"
                />
                <stop offset={lineColors.moderatePercentage} stopColor="pink" />
                <stop offset="100%" stopColor="pink" />
              </linearGradient>
            </defs>
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="value"
              strokeWidth={2}
              legendType="circle"
              stroke="url(#colorBpm)"
              dot={false}
            />
            <ReferenceLine
              yAxisId="bpm"
              strokeWidth={1}
              stroke="green"
              y={zones.Moderate}
            />

            <ReferenceLine
              yAxisId="bpm"
              strokeWidth={1}
              stroke="yellow"
              y={zones.Vigorous}
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

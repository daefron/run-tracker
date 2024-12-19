import {
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
  Tooltip,
  YAxis,
} from "recharts";
export function SelectedChart({
  runs,
  activeRun,
  render,
  setActiveRun,
  selectedType,
  setSelectedType,
}) {
  function TooltipContent({ payload }) {
    if (payload[0]) {
      if (selectedType === "bpm") {
        return (
          <>
            <p className="smallFont">Time: {payload[0].payload.time}</p>
            <p className="smallFont">BPM: {payload[0].payload.bpm}</p>
          </>
        );
      }
      if (selectedType === "steps") {
        return (
          <>
            <p className="smallFont">Time: {payload[0].payload.time}</p>
            <p className="smallFont">Steps: {payload[0].payload.value}</p>
          </>
        );
      }
    }
  }
  function SmallerLegend() {
    const listStyle = {
      display: "flex",
      justifyContent: "center",
      gap: "35px",
      margin: 0,
    };
    if (selectedType === "bpm") {
      const data = [
        { value: "Light", color: "pink" },
        { value: "Moderate", color: "green" },
        { value: "Vigorous", color: "yellow" },
        { value: "Peak", color: "red" },
      ];
      return (
        <ul style={listStyle}>
          {data.map((entry, index) => (
            <li
              key={"item-" + index}
              className="recharts-legend-item-text smallFont"
              style={{ color: entry.color, paddingLeft: "2px" }}
            >
              {entry.value.charAt(0).toLowerCase() + entry.value.slice(1)}
            </li>
          ))}
        </ul>
      );
    }
    if (selectedType === "steps") {
      return (
        <ul style={listStyle}>
          <li
            className="recharts-legend-item-text smallFont"
            style={{ color: "rgb(200, 200, 200)", paddingLeft: "2px" }}
          >
            steps
          </li>
        </ul>
      );
    }
  }
  function getChartData() {
    if (selectedType === "bpm") {
      return runs[activeRun]["heartRateArray"];
    } else {
      return runs[activeRun][selectedType + "Array"];
    }
  }
  const chartData = getChartData();
  const zones = zoneGetter(runs[activeRun].heartRateZones);
  const lineColors = {
    peakPercentage: lineColor("Peak"),
    vigorousPercentage: lineColor("Vigorous"),
    moderatePercentage: lineColor("Moderate"),
  };
  function lineColor(type) {
    let highest = highestValue(chartData);
    let lowest = lowestValue(chartData);
    let percentageOf = (1 - (zones[type] - lowest) / (highest - lowest)) * 100;
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
  function zoneGetter(data) {
    let parsedData = {};
    data.forEach((value) => {
      parsedData[value.name] = value.min;
    });
    return parsedData;
  }
  function SmallerAxisTick({ payload, x, y }) {
    return (
      <g transform={"translate(" + x + "," + y + ")"}>
        <text dx={0} dy={5} textAnchor="end" fill="white" className="smallFont">
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
  return (
    <div className="graphHolder" id={"selectedGraph"}>
      <div className="elementHeader" id="selectedHeader">
        <p className="titleFont">{render}</p>
        <p
          className="selectedButton titleFont"
          onClick={() => {
            setSelectedType("bpm");
          }}
          style={
            selectedType === "bpm" ? { textDecoration: "underline" } : null
          }
        >
          BPM
        </p>
        <p
          className="selectedButton titleFont"
          onClick={() => {
            setSelectedType("steps");
          }}
          style={
            selectedType === "steps" ? { textDecoration: "underline" } : null
          }
        >
          Steps
        </p>
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
            yAxisId={selectedType}
            width={25}
            tick={<SmallerAxisTick />}
            tickCount={3}
            domain={["dataMin", "dataMax"]}
          />
          <Line
            yAxisId={selectedType}
            animationBegin={0}
            animationDuration={300}
            dataKey="value"
            strokeWidth={2}
            legendType="circle"
            stroke={
              selectedType === "bpm"
                ? "url(#colorBpm)"
                : selectedType === "steps"
                ? "rgb(200, 200, 200)"
                : "white"
            }
            dot={false}
          />
          {selectedType === "bpm" ? (
            <>
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
                  <stop
                    offset={lineColors.moderatePercentage}
                    stopColor="pink"
                  />
                  <stop offset="100%" stopColor="pink" />
                </linearGradient>
              </defs>
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
            </>
          ) : (
            <></>
          )}
          <Legend content={<SmallerLegend />} />
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

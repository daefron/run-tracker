import { dateArrayToRender, trendLine, dateFiller } from "../Tools.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Fragment } from "react";
export function AllChart({
  render,
  lineColors,
  runs,
  activeRun,
  baselineDate,
  dateRangeChange,
  dateRange,
  setDateRange,
  predictedOnGraph,
  trendlineOnGraph,
  predictedRuns,
  marginAmount,
  lineVisibility,
  setLineVisibility,
}) {
  function DateRangeChangeButton({ value, render, dateRangeChange }) {
    return (
      <p
        onClick={() => {
          dateRangeChangeButton(value);
        }}
        className={
          dateRangeChange.current === value
            ? "dateChangeActive smallFont"
            : "dateChangeInactive smallFont"
        }
      >
        {render}
      </p>
    );
  }
  function dateRangeChangeButton(amount) {
    dateRangeChange.current = amount;
    setDateRange(dateArrayToRender(amount, baselineDate, marginAmount));
  }

  function DateShiftButton({ value, render }) {
    return (
      <p
        onClick={() => {
          dateRangeShiftButton(value);
        }}
        className="smallFont"
        style={{
          cursor: "pointer",
        }}
      >
        {render}
      </p>
    );
  }
  function dateRangeShiftButton(direction) {
    if (direction === "left") {
      baselineDate.current.setDate(
        baselineDate.current.getDate() - dateRangeChange.current
      );
    } else {
      baselineDate.current.setDate(
        baselineDate.current.getDate() + dateRangeChange.current
      );
    }
    setDateRange(
      dateArrayToRender(dateRangeChange.current, baselineDate, marginAmount)
    );
  }
  function TooltipContent({ payload }) {
    if (!payload[0]) {
      return;
    }
    let currentRun = runs.find((run) => run.id === payload[0].payload.id);
    if (!currentRun) {
      return (
        <>
          <p className="smallFont">Date: {predictedRuns[0].render.date}</p>
          <p className="smallFont">
            Duration: {predictedRuns[0].render.duration}
          </p>
          <p className="smallFont">
            Distance: {predictedRuns[0].render.distance}
          </p>
          <p className="smallFont">Speed: {predictedRuns[0].render.speed}</p>
          <p className="smallFont">
            Heart rate: {predictedRuns[0].render.heartRate}
          </p>
        </>
      );
    }
    return (
      <>
        <p className="smallFont">Date: {currentRun.render.date}</p>
        <p className="smallFont">Duration: {currentRun.render.duration}</p>
        <p className="smallFont">Distance: {currentRun.render.distance}</p>
        <p className="smallFont">Speed: {currentRun.render.speed}</p>
        <p className="smallFont">Heart rate: {currentRun.render.heartRate}</p>
      </>
    );
  }

  function transparentRGB(color) {
    let firstSplit = color.split("(");
    let aAdded = firstSplit[0] + "a(" + firstSplit[1];
    let secondSplit = aAdded.split(")");
    return secondSplit[0] + ", 0.5)";
  }

  function PredictionDot(payload) {
    if (!payload.payload.idPrediction) {
      return;
    }
    return (
      <circle
        r="3"
        cx={payload.cx}
        cy={payload.cy}
        fill={payload.color}
      ></circle>
    );
  }
  function DotRender(payload) {
    if (!payload.payload.id) {
      return;
    }
    if (payload.payload.id === payload.runs[payload.activeRun].id) {
      return (
        <>
          <circle
            r="4"
            cx={payload.cx}
            cy={payload.cy}
            fill={payload.color}
            stroke="rgb(255, 255, 255, 0.2)"
            strokeWidth={6}
          ></circle>
          <circle
            r="4"
            cx={payload.cx}
            cy={payload.cy}
            fill={payload.color}
            stroke="rgb(255, 255, 255)"
            strokeWidth={1}
          ></circle>
        </>
      );
    }
    return (
      <circle
        r="4"
        cx={payload.cx}
        cy={payload.cy}
        fill={payload.color}
      ></circle>
    );
  }
  function SmallerLegend(payload) {
    let data = payload.payload.filter((value) => value.type !== "none");
    const listStyle = {
      display: "flex",
      justifyContent: "center",
      gap: "35px",
      margin: 0,
    };
    data.forEach((value) => {
      if (!lineVisibility[value.value]) {
        value.color = transparentRGB(value.color);
      }
    });
    return (
      <ul style={listStyle}>
        {data.map((entry, index) => (
          <li
            key={"item-" + index}
            onClick={() => {
              setLineVisibility(swapLine(entry.value));
            }}
            className="recharts-legend-item-text smallFont"
            style={{ color: entry.color }}
          >
            {entry.value}
          </li>
        ))}
      </ul>
    );
  }
  function swapLine(selectedType) {
    let newLines = {};
    types.forEach((type) => {
      newLines[type] = lineVisibility[type];
    });
    newLines[selectedType] = !lineVisibility[selectedType];
    return newLines;
  }
  function TodayLabel(payload) {
    return (
      <text
        x={payload.viewBox.x}
        y={payload.viewBox.y + payload.viewBox.height - 10}
        className="smallFont"
        fill="rgba(255, 255, 255, 0.5)"
      >
        - Today
      </text>
    );
  }
  function MonthLabel(payload) {
    return (
      <text
        x={payload.viewBox.x}
        y={payload.viewBox.y + payload.viewBox.height - 10}
        className="smallFont"
        fill="rgba(255, 255, 255, 0.3)"
      >
        - {payload.month}
      </text>
    );
  }
  function SmallerAxisTick({ payload, x, y }) {
    return (
      <g transform={"translate(" + x + "," + y + ")"}>
        <text
          dx={8}
          dy={12}
          textAnchor="end"
          fill="white"
          className="smallFont"
        >
          {payload.value}
        </text>
      </g>
    );
  }
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "calories",
    "steps",
  ];
  const predictionData = dateFiller(predictedRuns, dateRange, types);
  const chartData = chartFiller(dateFiller(runs, dateRange, types));
  function chartFiller(data) {
    for (let i = 0; i <= data.length; i++) {
      predictedRuns.forEach((run) => {
        if (i === run.chartOrder) {
          for (const key in predictionData[i]) {
            if (key === "heartRate" && !run.heartRate) {
              data[i][key + "Prediction"] = null;
            } else {
              data[i][key + "Prediction"] = predictionData[i][key];
            }
          }
        }
      });
    }
    return data;
  }
  const trends = trendFiller();
  function trendFiller() {
    let trendHolder = {};
    types.forEach((type, i) => {
      trendHolder[type] = trendLine(chartData, type);
    });
    return trendHolder;
  }

  const todayInGraph = todayChecker();
  function todayChecker() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear().toString();
    const parsedToday =
      currentDay + "/" + currentMonth + "/" + currentYear[2] + currentYear[3];
    for (let i = 0; i < chartData.length; i++) {
      if (parsedToday === chartData[i].parsedDate) {
        return chartData[i].order;
      }
    }
  }
  const newMonths = newMonthChecker();
  function newMonthChecker() {
    let dateHolder = [];
    chartData.forEach((date) => {
      if (date.date === "01") {
        let day = Number(date.parsedDate[0] + date.parsedDate[1]);
        let month = Number(date.parsedDate[3] + date.parsedDate[4] - 1);
        let year = Number(20 + date.parsedDate[6] + date.parsedDate[7]);
        let parsedMonth = new Date(year, month, day).toString().split(" ")[1];
        dateHolder.push([date.order, parsedMonth]);
      }
    });
    return dateHolder;
  }
  const dateGap = predictedRuns[0].gap;
  const graphMax = graphPadding();
  function graphPadding() {
    let paddedTypes = {};
    types.forEach((type) => {
      let highestValue = 0;
      for (let i = 0; i < runs.length; i++) {
        if (runs[i][type] > highestValue) {
          highestValue = runs[i][type];
        }
      }
      const paddedValue = highestValue * 1.2;
      paddedTypes[type] = paddedValue;
    });
    return paddedTypes;
  }
  const lines = types.map((type) => {
    const line = (
      <Line
        yAxisId={type}
        dataKey={type}
        stroke={lineColors[type]}
        strokeWidth={2}
        dot={
          lineVisibility[type] ? (
            <DotRender
              color={lineColors[type]}
              runs={runs}
              activeRun={activeRun}
            />
          ) : (
            false
          )
        }
        legendType="circle"
        activeDot={false}
        connectNulls={lineVisibility[type] ? true : false}
        isAnimationActive={false}
      />
    );
    const yAxis = <YAxis yAxisId={type} domain={[0, graphMax[type]]} hide />;
    const prediction = (
      <Line
        yAxisId={type}
        dataKey={type + "Prediction"}
        stroke={transparentRGB(lineColors[type])}
        strokeWidth={1}
        dot={
          lineVisibility[type] ? (
            <PredictionDot
              color={transparentRGB(lineColors[type])}
              runs={runs}
              activeRun={activeRun}
            />
          ) : (
            false
          )
        }
        activeDot={false}
        legendType="none"
        connectNulls={lineVisibility[type] ? true : false}
        isAnimationActive={false}
      />
    );
    const predictionLine = (
      <ReferenceLine
        yAxisId={type}
        segment={
          lineVisibility[type]
            ? [
                {
                  x: trends[type].xStart,
                  y: trends[type].calcY(trends[type].xStart),
                },
                {
                  x: trends[type].xEnd + dateGap,
                  y: trends[type].calcY(trends[type].xEnd + dateGap),
                },
              ]
            : false
        }
        stroke={transparentRGB(lineColors[type])}
        isAnimationActive={false}
      />
    );
    return (
      <Fragment key={type + "Line"}>
        {yAxis}
        {line}
        {predictedOnGraph ? prediction : <></>}
        {trendlineOnGraph ? predictionLine : <></>}
      </Fragment>
    );
  });
  const referenceLines = (
    <>
      <YAxis hide />
      {todayInGraph ? (
        <ReferenceLine
          strokeWidth={1}
          x={todayInGraph}
          stroke="rgba(255, 255, 255, 0.5)"
          label={<TodayLabel />}
        />
      ) : (
        <></>
      )}
      {newMonths[0] && dateRangeChange.current <= 32 ? (
        <ReferenceLine
          strokeWidth={1}
          x={newMonths[0][0]}
          stroke="rgba(255, 255, 255, 0.3)"
          label={<MonthLabel month={newMonths[0][1]} />}
        />
      ) : (
        <></>
      )}
    </>
  );
  return (
    <div className="graphHolder" id="allRunsGraph">
      <div className="elementHeader">
        <p className="titleFont">{render}</p>
        <div className="graphDateHolder">
          <DateRangeChangeButton
            value={6}
            render="W"
            dateRangeChange={dateRangeChange}
          />
          <DateRangeChangeButton
            value={31}
            render="M"
            dateRangeChange={dateRangeChange}
          />
          <DateRangeChangeButton
            value={365}
            render="Y"
            dateRangeChange={dateRangeChange}
          />
          <DateShiftButton value="left" render="<-" />
          <p className="smallFont">
            {dateRange[0] + " - " + dateRange[dateRangeChange.current]}
          </p>
          <DateShiftButton value="right" render="->" />
        </div>
      </div>
      <ResponsiveContainer>
        <LineChart
          margin={{ top: 0, left: 20, right: 30, bottom: 10 }}
          data={chartData}
        >
          <XAxis dataKey="date" tick={<SmallerAxisTick />} />
          {lines}
          {referenceLines}
          <Legend content={<SmallerLegend />} />
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

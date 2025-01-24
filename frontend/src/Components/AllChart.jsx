import { trendLine, dateFiller } from "../Tools.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
} from "recharts";
import { Fragment } from "react";
export function AllChart({
  render,
  lineColors,
  runs,
  activeRun,
  dateRange,
  predictedOnGraph,
  trendlineOnGraph,
  predictedRuns,
  lineVisibility,
  setLineVisibility,
  brushStart,
  brushEnd,
}) {
  function TooltipContent({ payload }) {
    if (!payload[0]) {
      return;
    }
    let currentRun = runs.find((run) => run.id === payload[0].payload.id);
    if (!currentRun) {
      return (
        <>
          <p className="smallFont">Date: {predictedRuns[0].render.date}</p>
          {lineVisibility.duration ? (
            <p className="smallFont">
              Duration: {predictedRuns[0].render.duration}
            </p>
          ) : null}
          {lineVisibility.distance ? (
            <p className="smallFont">
              Distance: {predictedRuns[0].render.distance}
            </p>
          ) : null}
          {lineVisibility.speed ? (
            <p className="smallFont">Speed: {predictedRuns[0].render.speed}</p>
          ) : null}
          {lineVisibility.heartRate ? (
            <p className="smallFont">
              Heart rate: {predictedRuns[0].render.heartRate}
            </p>
          ) : null}
          {lineVisibility.calories ? (
            <p className="smallFont">
              Calories: {predictedRuns[0].render.calories}
            </p>
          ) : null}
          {lineVisibility.steps ? (
            <p className="smallFont">Steps: {predictedRuns[0].render.steps}</p>
          ) : null}
        </>
      );
    }
    return (
      <>
        <p className="smallFont">Date: {currentRun.render.date}</p>
        {lineVisibility.duration ? (
          <p className="smallFont">Duration: {currentRun.render.duration}</p>
        ) : null}
        {lineVisibility.distance ? (
          <p className="smallFont">Distance: {currentRun.render.distance}</p>
        ) : null}
        {lineVisibility.speed ? (
          <p className="smallFont">Speed: {currentRun.render.speed}</p>
        ) : null}
        {lineVisibility.heartRate ? (
          <p className="smallFont">Heart rate: {currentRun.render.heartRate}</p>
        ) : null}
        {lineVisibility.calories ? (
          <p className="smallFont">Calories: {currentRun.render.calories}</p>
        ) : null}
        {lineVisibility.steps ? (
          <p className="smallFont">Steps: {currentRun.render.steps}</p>
        ) : null}
        {lineVisibility.temp ? (
          <p className="smallFont">Temperature: {currentRun.render.temp}</p>
        ) : null}
      </>
    );
  }

  function transparentRGB(color) {
    let firstSplit = color.split("(");
    let aAdded = firstSplit[0] + "a(" + firstSplit[1];
    let secondSplit = aAdded.split(")");
    return secondSplit[0] + ", 0.3)";
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
      gap: "25px",
      margin: 0,
      marginLeft: -25,
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
            className="recharts-legend-item-text"
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

  function SmallerAxisTick() {
    return;
  }
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "calories",
    "steps",
    "temp",
  ];

  const predictionData = dateFiller(predictedRuns, dateRange, types);
  const chartData = chartFiller(dateFiller(runs, dateRange, types));

  function chartFiller(data) {
    predictedRuns.forEach((run) => {
      for (const key in predictionData[run.chartOrder]) {
        data[run.chartOrder][key + "Prediction"] =
          predictionData[run.chartOrder][key];
      }
    });
    return data;
  }
  const trends = trendFiller();
  function trendFiller() {
    let trendHolder = {};
    types.forEach((type, i) => {
      if (type === "temp") {
        return;
      }
      trendHolder[type] = trendLine(chartData, type);
    });
    return trendHolder;
  }
  const todayInGraph = todayChecker();
  function todayChecker() {
    const today = new Date();
    let currentDay = today.getDate().toString();
    if (currentDay.length < 2) {
      currentDay = "0" + currentDay;
    }
    let currentMonth = (today.getMonth() + 1).toString();
    if (currentMonth.length < 2) {
      currentMonth = "0" + currentMonth;
    }
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
  const graphMax = graphMaxPadding();
  const graphMin = graphMinPadding();
  function graphMaxPadding() {
    let paddedTypes = {};
    types.forEach((type) => {
      let highestValue = 0;
      for (let i = 0; i < runs.length; i++) {
        if (runs[i][type] > highestValue) {
          highestValue = runs[i][type];
        }
      }
      const paddedValue = highestValue * 1.03;
      paddedTypes[type] = paddedValue;
    });
    return paddedTypes;
  }
  function graphMinPadding() {
    let paddedTypes = {};
    types.forEach((type) => {
      let lowestValue = Infinity;
      for (let i = 0; i < runs.length; i++) {
        if (runs[i][type] < lowestValue) {
          lowestValue = runs[i][type];
        }
      }
      const paddedValue = lowestValue * 0.8;
      paddedTypes[type] = paddedValue;
    });
    return paddedTypes;
  }
  const brushLines = types.map((type) => {
    const line = (
      <Line
        yAxisId={type}
        dataKey={type}
        stroke={lineColors[type]}
        strokeWidth={2}
        dot={false}
        connectNulls={lineVisibility[type] ? true : false}
        isAnimationActive={false}
      />
    );
    const yAxis = (
      <YAxis yAxisId={type} domain={[graphMin[type], graphMax[type]]} hide />
    );
    return (
      <Fragment key={type + "Line"}>
        {yAxis}
        {line}
      </Fragment>
    );
  });
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
    const yAxis = (
      <YAxis yAxisId={type} domain={[graphMin[type], graphMax[type]]} hide />
    );
    if (type === "temp") {
      return (
        <Fragment key={type + "Line"}>
          {yAxis}
          {line}
        </Fragment>
      );
    }
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
    const predictionLines = predictionData.map((prediction) => {
      if (prediction.order < predictedRuns[0].chartOrder) {
        return (
          <Fragment key={"predictionLine" + prediction.parsedDate}>
            <ReferenceLine
              yAxisId={type}
              segment={
                lineVisibility[type]
                  ? [
                      {
                        x: prediction.order,
                        y: trends[type].calcY(prediction.order),
                      },
                      {
                        x: prediction.order + 1,
                        y: trends[type].calcY(prediction.order + 1),
                      },
                    ]
                  : false
              }
              stroke={transparentRGB(lineColors[type])}
              isAnimationActive={false}
            />
          </Fragment>
        );
      }
    });
    return (
      <Fragment key={type + "Line"}>
        {yAxis}
        {line}
        {predictedOnGraph ? prediction : <></>}
        {trendlineOnGraph ? predictionLines : <></>}
      </Fragment>
    );
  });
  const dateLines = newMonths.map((month) => {
    return (
      <Fragment key={"monthLine" + month[1]}>
        <ReferenceLine
          strokeWidth={1}
          x={month[0]}
          stroke="rgba(255, 255, 255, 0.3)"
          label={<MonthLabel month={month[1]} />}
        />
      </Fragment>
    );
  });
  const referenceLines = (
    <>
      <YAxis hide />
      <ReferenceLine
        strokeWidth={1}
        x={todayInGraph}
        stroke="rgba(255, 255, 255, 0.5)"
        label={<TodayLabel />}
      />
      {dateLines}
    </>
  );
  function brushChange(payload) {
    brushStart.current = payload.startIndex;
    brushEnd.current = payload.endIndex;
  }
  return (
    <div className="graphHolder" id="allRunsGraph">
      <div className="elementHeader">
        <p className="titleFont">{render}</p>
      </div>
      <ResponsiveContainer>
        <LineChart
          margin={{ top: 0, left: 25, right: 25, bottom: 5 }}
          data={chartData}
        >
          tickSize={8}
          <XAxis
            dataKey="order"
            tick={<SmallerAxisTick />}
            interval={0}
            align={"center"}
            mirror
          />
          {lines}
          {referenceLines}
          <Legend content={<SmallerLegend />} />
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
          <Brush
            data={chartData}
            dataKey={"order"}
            startIndex={brushStart.current}
            endIndex={brushEnd.current}
            onChange={brushChange}
          >
            <LineChart data={chartData}>{brushLines}</LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import { dateArrayToRender, trendLine, dateFiller } from "../Tools.jsx";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export function AllChart({
  runs,
  dateRange,
  dateRangeChange,
  baselineDate,
  activeRun,
  render,
  durationColor,
  distanceColor,
  speedColor,
  heartRateColor,
  setDateRange,
  predictedOnGraph,
  trendlineOnGraph,
  predictedRuns,
  marginAmount,
}) {
  if (!runs && !predictedRuns[0]) {
    return;
  }
  function DateRangeChangeButton({ value, render, dateRangeChange }) {
    return (
      <p
        onClick={() => {
          dateRangeChangeButton(value);
        }}
        className={
          dateRangeChange.current === value
            ? "dateChangeActive"
            : "dateChangeInactive"
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
          <p>Date: {predictedRuns[0].render.date}</p>
          <p>Duration: {predictedRuns[0].render.duration}</p>
          <p>Distance: {predictedRuns[0].render.distance}</p>
          <p>Speed: {predictedRuns[0].render.speed}</p>
          <p>Heart rate: {predictedRuns[0].render.heartRate}</p>
        </>
      );
    }
    return (
      <>
        <p>Date: {currentRun.render.date}</p>
        <p>Duration: {currentRun.render.duration}</p>
        <p>Distance: {currentRun.render.distance}</p>
        <p>Speed: {currentRun.render.speed}</p>
        <p>Heart rate: {currentRun.render.heartRate}</p>
      </>
    );
  }

  function gridMaker(dimension, divider) {
    let array = [];
    for (let i = 20; i < dimension; i += dimension / divider) {
      array.push(i);
    }
    return array;
  }

  function predictionColor(color) {
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

  function TodayLabel(payload) {
    return (
      <text
        x={payload.viewBox.x}
        y={payload.viewBox.y + payload.viewBox.height - 10}
        fontSize="14"
        fill="white"
      >
        - today
      </text>
    );
  }
  function MonthLabel(payload) {
    return (
      <text
        x={payload.viewBox.x}
        y={payload.viewBox.y + payload.viewBox.height - 10}
        fontSize="14"
        fill="rgba(255, 255, 255, 0.3)"
      >
        - {payload.month}
      </text>
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
  return (
    <div className="graphHolder" id="allRunsGraph">
      <div className="graphTop">
        <p className="graphTitle">{render}</p>
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
          <p>{dateRange[0] + " - " + dateRange[dateRangeChange.current]}</p>
          <DateShiftButton value="right" render="->" />
        </div>
      </div>
      <ResponsiveContainer>
        <LineChart margin={{ top: 20, left: 20, right: 20 }} data={chartData}>
          <CartesianGrid
            stroke="rgba(255, 255, 255, 0.1)"
            horizontalCoordinatesGenerator={({ height }) =>
              gridMaker(height, 10)
            }
            verticalCoordinatesGenerator={({ width }) => gridMaker(width, 15)}
          />
          <Legend />
          <XAxis dataKey="date" dy={5} />
          <YAxis yAxisId="duration" domain={[0, "dataMax + 300000"]} hide />
          <ReferenceLine
            yAxisId="distance"
            strokeWidth={1}
            stroke="rgba(255, 255, 255, 0.1)"
            x={dateRangeChange.current}
          />
          {todayInGraph ? (
            <ReferenceLine
              yAxisId="distance"
              strokeWidth={1}
              x={todayInGraph}
              stroke="white"
              label={<TodayLabel />}
            />
          ) : (
            <></>
          )}
          {newMonths[0] && dateRangeChange.current <= 32 ? (
            <ReferenceLine
              yAxisId="distance"
              strokeWidth={1}
              x={newMonths[0][0]}
              stroke="rgba(255, 255, 255, 0.3)"
              label={<MonthLabel month={newMonths[0][1]} />}
            />
          ) : (
            <></>
          )}
          <Line
            yAxisId="duration"
            isAnimationActive={false}
            dataKey="duration"
            stroke={durationColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={durationColor}
                runs={runs}
                activeRun={activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {predictedOnGraph ? (
            <Line
              yAxisId="duration"
              isAnimationActive={false}
              dataKey="durationPrediction"
              stroke={predictionColor(durationColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(durationColor)}
                  runs={runs}
                  activeRun={activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {trendlineOnGraph ? (
            <ReferenceLine
              yAxisId="duration"
              segment={[
                {
                  x: trends.duration.xStart,
                  y: trends.duration.calcY(trends.duration.xStart),
                },
                {
                  x: trends.duration.xEnd + dateGap,
                  y: trends.duration.calcY(trends.duration.xEnd + dateGap),
                },
              ]}
              stroke={predictionColor(durationColor)}
            />
          ) : (
            <></>
          )}
          <YAxis yAxisId="distance" domain={[0, "dataMax + 1"]} hide />
          <Line
            yAxisId="distance"
            isAnimationActive={false}
            dataKey="distance"
            stroke={distanceColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={distanceColor}
                runs={runs}
                activeRun={activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {predictedOnGraph ? (
            <Line
              yAxisId="distance"
              isAnimationActive={false}
              dataKey="distancePrediction"
              stroke={predictionColor(distanceColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(distanceColor)}
                  runs={runs}
                  activeRun={activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {trendlineOnGraph ? (
            <ReferenceLine
              yAxisId="distance"
              segment={[
                {
                  x: trends.distance.xStart,
                  y: trends.distance.calcY(trends.distance.xStart),
                },
                {
                  x: trends.distance.xEnd + dateGap,
                  y: trends.distance.calcY(trends.distance.xEnd + dateGap),
                },
              ]}
              stroke={predictionColor(distanceColor)}
            />
          ) : (
            <></>
          )}
          <YAxis yAxisId="speed" domain={[0, "dataMax + 4"]} hide />
          <Line
            yAxisId="speed"
            isAnimationActive={false}
            dataKey="speed"
            stroke={speedColor}
            strokeWidth={2}
            dot={
              <DotRender color={speedColor} runs={runs} activeRun={activeRun} />
            }
            activeDot={false}
            connectNulls
          />
          {predictedOnGraph ? (
            <Line
              yAxisId="speed"
              isAnimationActive={false}
              dataKey="speedPrediction"
              stroke={predictionColor(speedColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(speedColor)}
                  runs={runs}
                  activeRun={activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {trendlineOnGraph ? (
            <ReferenceLine
              yAxisId="speed"
              segment={[
                {
                  x: trends.speed.xStart,
                  y: trends.speed.calcY(trends.speed.xStart),
                },
                {
                  x: trends.speed.xEnd + dateGap,
                  y: trends.speed.calcY(trends.speed.xEnd + dateGap),
                },
              ]}
              stroke={predictionColor(speedColor)}
            />
          ) : (
            <></>
          )}
          <YAxis yAxisId="heartRate" domain={[0, "dataMax + 40"]} hide />
          <Line
            yAxisId="heartRate"
            isAnimationActive={false}
            dataKey="heartRate"
            stroke={heartRateColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={heartRateColor}
                runs={runs}
                activeRun={activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {predictedOnGraph ? (
            <Line
              yAxisId="heartRate"
              isAnimationActive={false}
              dataKey="heartRatePrediction"
              stroke={predictionColor(heartRateColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(heartRateColor)}
                  runs={runs}
                  activeRun={activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {trendlineOnGraph ? (
            <ReferenceLine
              yAxisId="heartRate"
              segment={[
                {
                  x: trends.heartRate.xStart,
                  y: trends.heartRate.calcY(trends.heartRate.xStart),
                },
                {
                  x: trends.heartRate.xEnd + dateGap,
                  y: trends.heartRate.calcY(trends.heartRate.xEnd + dateGap),
                },
              ]}
              stroke={predictionColor(heartRateColor)}
            />
          ) : (
            <></>
          )}
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

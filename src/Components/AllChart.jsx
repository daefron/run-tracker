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
export function AllChart(props) {
  if (!props.runs) {
    return;
  }
  function DateRangeChangeButton(props) {
    return (
      <p
        onClick={() => {
          dateRangeChangeButton(props.value);
        }}
        className={
          props.dateRangeChange.current === props.value
            ? "dateChangeActive"
            : "dateChangeInactive"
        }
      >
        {props.render}
      </p>
    );
  }
  function dateRangeChangeButton(amount) {
    props.dateRangeChange.current = amount;
    props.setDateRange(
      dateArrayToRender(amount, props.baselineDate, props.marginAmount)
    );
  }
  function DateShiftButton(props) {
    return (
      <p
        onClick={() => {
          dateRangeShiftButton(props.value);
        }}
        style={{
          cursor: "pointer",
        }}
      >
        {props.render}
      </p>
    );
  }
  function dateRangeShiftButton(direction) {
    if (direction === "left") {
      props.baselineDate.current.setDate(
        props.baselineDate.current.getDate() - props.dateRangeChange.current
      );
    } else {
      props.baselineDate.current.setDate(
        props.baselineDate.current.getDate() + props.dateRangeChange.current
      );
    }
    props.setDateRange(
      dateArrayToRender(
        props.dateRangeChange.current,
        props.baselineDate,
        props.marginAmount
      )
    );
  }
  function TooltipContent({ payload }) {
    if (!payload[0]) {
      return;
    }
    let currentRun = props.runs.find((run) => run.id === payload[0].payload.id);
    if (!currentRun) {
      return (
        <>
          <p>Date: {props.predictedRuns[0].render.date}</p>
          <p>Duration: {props.predictedRuns[0].render.duration}</p>
          <p>Distance: {props.predictedRuns[0].render.distance}</p>
          <p>Speed: {props.predictedRuns[0].render.speed}</p>
          <p>Heart rate: {props.predictedRuns[0].render.heartRate}</p>
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
  const predictionData = dateFiller(
    props.predictedRuns,
    props.dateRange,
    types
  );
  const chartData = chartFiller(dateFiller(props.runs, props.dateRange, types));
  function chartFiller(data) {
    for (let i = 0; i <= data.length; i++) {
      props.predictedRuns.forEach((run) => {
        if (i === run.chartOrder) {
          for (const key in predictionData[i]) {
            data[i][key + "Prediction"] = predictionData[i][key];
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
  const dateGap = props.predictedRuns[0].gap;
  return (
    <div className="graphHolder" id="allRunsGraph">
      <div className="graphTop">
        <p className="graphTitle">{props.render}</p>
        <div className="graphDateHolder">
          <DateRangeChangeButton
            value={6}
            render="W"
            dateRangeChange={props.dateRangeChange}
          />
          <DateRangeChangeButton
            value={31}
            render="M"
            dateRangeChange={props.dateRangeChange}
          />
          <DateRangeChangeButton
            value={365}
            render="Y"
            dateRangeChange={props.dateRangeChange}
          />
          <DateShiftButton value="left" render="<-" />
          <p>
            {props.dateRange[0] +
              " - " +
              props.dateRange[props.dateRangeChange.current]}
          </p>
          <DateShiftButton value="right" render="->" />
        </div>
      </div>
      <ResponsiveContainer>
        <LineChart margin={{ top: 20, left: 20, right: 20 }} data={chartData}>
          <CartesianGrid
            stroke="rgba(255, 255, 255, 0.1)"
            horizontalCoordinatesGenerator={(props) =>
              gridMaker(props.height, 10)
            }
            verticalCoordinatesGenerator={(props) => gridMaker(props.width, 15)}
          />
          <Legend />
          <XAxis dataKey="date" dy={5} />
          <YAxis yAxisId="duration" domain={[0, "dataMax + 300000"]} hide />
          <ReferenceLine
            yAxisId="distance"
            strokeWidth={1}
            stroke="rgba(255, 255, 255, 0.1)"
            x={props.dateRangeChange.current}
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
          {newMonths[0] && props.dateRangeChange.current <= 32 ? (
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
            stroke={props.durationColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={props.durationColor}
                runs={props.runs}
                activeRun={props.activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {props.predictedOnGraph ? (
            <Line
              yAxisId="duration"
              isAnimationActive={false}
              dataKey="durationPrediction"
              stroke={predictionColor(props.durationColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(props.durationColor)}
                  runs={props.runs}
                  activeRun={props.activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {props.trendlineOnGraph ? (
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
              stroke={predictionColor(props.durationColor)}
            />
          ) : (
            <></>
          )}
          <YAxis yAxisId="distance" domain={[0, "dataMax + 1"]} hide />
          <Line
            yAxisId="distance"
            isAnimationActive={false}
            dataKey="distance"
            stroke={props.distanceColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={props.distanceColor}
                runs={props.runs}
                activeRun={props.activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {props.predictedOnGraph ? (
            <Line
              yAxisId="distance"
              isAnimationActive={false}
              dataKey="distancePrediction"
              stroke={predictionColor(props.distanceColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(props.distanceColor)}
                  runs={props.runs}
                  activeRun={props.activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {props.trendlineOnGraph ? (
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
              stroke={predictionColor(props.distanceColor)}
            />
          ) : (
            <></>
          )}
          <YAxis yAxisId="speed" domain={[0, "dataMax + 4"]} hide />
          <Line
            yAxisId="speed"
            isAnimationActive={false}
            dataKey="speed"
            stroke={props.speedColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={props.speedColor}
                runs={props.runs}
                activeRun={props.activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {props.predictedOnGraph ? (
            <Line
              yAxisId="speed"
              isAnimationActive={false}
              dataKey="speedPrediction"
              stroke={predictionColor(props.speedColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(props.speedColor)}
                  runs={props.runs}
                  activeRun={props.activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {props.trendlineOnGraph ? (
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
              stroke={predictionColor(props.speedColor)}
            />
          ) : (
            <></>
          )}
          <YAxis yAxisId="heartRate" domain={[0, "dataMax + 40"]} hide />
          <Line
            yAxisId="heartRate"
            isAnimationActive={false}
            dataKey="heartRate"
            stroke={props.heartRateColor}
            strokeWidth={2}
            dot={
              <DotRender
                color={props.heartRateColor}
                runs={props.runs}
                activeRun={props.activeRun}
              />
            }
            activeDot={false}
            connectNulls
          />
          {props.predictedOnGraph ? (
            <Line
              yAxisId="heartRate"
              isAnimationActive={false}
              dataKey="heartRatePrediction"
              stroke={predictionColor(props.heartRateColor)}
              strokeWidth={1}
              dot={
                <PredictionDot
                  color={predictionColor(props.heartRateColor)}
                  runs={props.runs}
                  activeRun={props.activeRun}
                />
              }
              activeDot={false}
              legendType="none"
              connectNulls
            />
          ) : (
            <></>
          )}
          {props.trendlineOnGraph ? (
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
              stroke={predictionColor(props.heartRateColor)}
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

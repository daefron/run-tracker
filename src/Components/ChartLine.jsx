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
import { useEffect } from "react";
import { dateArrayToRender, trendLine, dateFiller } from "../Tools.jsx";
import { PredictedRun } from "./PredictedRun.jsx";
export function ChartLine(props) {
  if (!props.runs) {
    return;
  }
  const types = [
    "duration",
    "distance",
    "speed",
    "heartRate",
    "calories",
    "steps",
  ];
  const predictedRun = new PredictedRun(
    props.baselineDate,
    props.dateRange,
    props.runs,
    types
  );

  function DotRender(payload) {
    if (payload.payload.bpm || !payload.payload.id) {
      return;
    }
    let color = payload.color;
    if (payload.payload.id === payload.runs[payload.activeRun].id) {
      return (
        <>
          <circle
            r="4"
            cx={payload.cx}
            cy={payload.cy}
            fill={color}
            stroke="rgb(255, 255, 255, 0.2)"
            strokeWidth={6}
          ></circle>
          <circle
            r="4"
            cx={payload.cx}
            cy={payload.cy}
            fill={color}
            stroke="rgb(255, 255, 255)"
            strokeWidth={1}
          ></circle>
        </>
      );
    }
    return <circle r="4" cx={payload.cx} cy={payload.cy} fill={color}></circle>;
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

  function predictionColor(color) {
    let firstSplit = color.split("(");
    let aAdded = firstSplit[0] + "a(" + firstSplit[1];
    let secondSplit = aAdded.split(")");
    return secondSplit[0] + ", 0.5)";
  }

  function TooltipContent({ payload }) {
    if (payload[0]) {
      if (payload[0].payload.bpm) {
        return (
          <>
            <p>Time: {payload[0].payload.time}</p>
            <p>BPM: {payload[0].payload.bpm}</p>
          </>
        );
      }
      let currentRun = props.runs.find(
        (run) => run.id === payload[0].payload.id
      );
      if (!currentRun) {
        return (
          <>
            <p>Date: {predictedRun.render.date}</p>
            <p>Duration: {predictedRun.render.duration}</p>
            <p>Distance: {predictedRun.render.distance}</p>
            <p>Speed: {predictedRun.render.speed}</p>
            <p>Heart rate: {predictedRun.render.heartRate}</p>
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
  }

  if (props.type === "allRuns") {
    const types = [
      "duration",
      "distance",
      "speed",
      "heartRate",
      "calories",
      "steps",
    ];
    let chartData = dateFiller(props.runs, props.dateRange, types);
    const durationTrend = trendLine(chartData, "duration");
    const distanceTrend = trendLine(chartData, "distance");
    const speedTrend = trendLine(chartData, "speed");
    const heartRateTrend = trendLine(chartData, "heartRate");
    const predictionRuns = [predictedRun];
    const predictionData = dateFiller(predictionRuns, props.dateRange, types);
    addPredictionData();
    function addPredictionData() {
      chartData.forEach((value, i) => {
        predictionRuns.forEach((run) => {
          if (i === run.chartOrder) {
            pushPredictionData();
          }
        });
        function pushPredictionData() {
          for (const key in predictionData[i]) {
            chartData[i][key + "Prediction"] = predictionData[i][key];
          }
        }
      });
      return chartData;
    }
    const dateGap = predictedRun.gap;
    function DateRangeChangeButton(props) {
      return (
        <p
          onClick={() => {
            dateRangeChangeButton(props.value);
          }}
          style={
            props.dateRangeChange.current === props.value
              ? {
                  fontWeight: "450",
                  textDecoration: "underline",
                  cursor: "pointer",
                }
              : {
                  fontWeight: "300",
                  cursor: "pointer",
                }
          }
        >
          {props.render}
        </p>
      );
    }
    function dateRangeChangeButton(amount) {
      props.dateRangeChange.current = amount;
      props.setDateRange(dateArrayToRender(amount, props.baselineDate));
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
        dateArrayToRender(props.dateRangeChange.current, props.baselineDate)
      );
    }
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
            <CartesianGrid strokeDasharray="5 20" vertical={false} />
            <Legend />
            <XAxis dataKey="date" dy={5} />
            <YAxis yAxisId="duration" domain={[0, "dataMax + 300000"]} hide />
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
                    x: durationTrend.xStart,
                    y: durationTrend.calcY(durationTrend.xStart),
                  },
                  {
                    x: durationTrend.xEnd + dateGap,
                    y: durationTrend.calcY(durationTrend.xEnd + dateGap),
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
                    x: distanceTrend.xStart,
                    y: distanceTrend.calcY(distanceTrend.xStart),
                  },
                  {
                    x: distanceTrend.xEnd + dateGap,
                    y: distanceTrend.calcY(distanceTrend.xEnd + dateGap),
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
                    x: speedTrend.xStart,
                    y: speedTrend.calcY(speedTrend.xStart),
                  },
                  {
                    x: speedTrend.xEnd + dateGap,
                    y: speedTrend.calcY(speedTrend.xEnd + dateGap),
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
                    x: heartRateTrend.xStart,
                    y: heartRateTrend.calcY(heartRateTrend.xStart),
                  },
                  {
                    x: heartRateTrend.xEnd + dateGap,
                    y: heartRateTrend.calcY(heartRateTrend.xEnd + dateGap),
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
  } else if (props.type === "selected") {
    const chartData = bpmChartData(props.runs[props.activeRun].heartRateArray);
    function bpmChartData(chartData) {
      let zones = props.runs[props.activeRun].heartRateZones;
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
    function ActiveRunShiftButton(props) {
      return (
        <p
          onClick={() => {
            activeRunShiftButton(props.value);
          }}
          style={
            (props.value === "right" && !props.activeRun) ||
            (props.value === "left" && !props.runs[props.activeRun + 1])
              ? {
                  color: "dimGrey",
                }
              : {
                  color: "white",
                  cursor: "pointer",
                }
          }
        >
          {props.render}
        </p>
      );
    }
    function activeRunShiftButton(direction) {
      if (direction === "right" && props.activeRun) {
        props.setActiveRun(props.activeRun - 1);
      } else if (direction === "left" && props.runs[props.activeRun + 1]) {
        props.setActiveRun(props.activeRun + 1);
      }
    }
    return (
      <div className="graphHolder" id={"selectedGraph"}>
        <div className="graphTop">
          <p className="graphTitle">{props.render}</p>
          <div className="graphDateHolder">
            <ActiveRunShiftButton
              value="left"
              render="<-"
              activeRun={props.activeRun}
              runs={props.runs}
            />
            <p>{props.runs[props.activeRun].render.date}</p>
            <ActiveRunShiftButton
              value="right"
              render="->"
              activeRun={props.activeRun}
              runs={props.runs}
            />
          </div>
        </div>
        <ResponsiveContainer>
          <LineChart margin={{ top: 20, left: 20, right: 20 }} data={chartData}>
            <CartesianGrid strokeDasharray="5 20" vertical={false} />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Light"
              stroke="hotPink"
              strokeWidth={2}
              dot={<DotRender />}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Moderate"
              stroke="green"
              strokeWidth={2}
              dot={<DotRender />}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Vigorous"
              stroke="yellow"
              strokeWidth={2}
              dot={<DotRender />}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Peak"
              stroke="red"
              strokeWidth={2}
              dot={<DotRender />}
            />
            <Legend />
            <Tooltip content={<TooltipContent />} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

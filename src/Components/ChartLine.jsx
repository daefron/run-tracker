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
import { objectToMs, dateArrayToRender } from "../Tools.jsx";
export function ChartLine(props) {
  if (!props.runs) {
    return;
  }
  function DotRender(payload) {
    if (payload.payload.id === null || payload.payload.bpm) {
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

  function trendLine(data, type) {
    data.forEach((point, i) => {
      point.order = i;
    });
    let dataSet = data.filter((point) => point.id);
    const xData = dataSet.map((point) => point.order);
    const yData = dataSet.map((point) => point[type]);
    const xMean = average(xData);
    const yMean = average(yData);
    function average(data) {
      const dataTotal = data.reduce((total, value) => total + value);
      return dataTotal / data.length;
    }
    const xMinusxMean = xData.map((value) => value - xMean);
    const yMinusyMean = yData.map((value) => value - yMean);
    const xMinusxMeanSq = xMinusxMean.map((val) => Math.pow(val, 2));
    const xy = [];
    for (let x = 0; x < dataSet.length; x++) {
      xy.push(xMinusxMean[x] * yMinusyMean[x]);
    }
    function sum(array) {
      return array.reduce((total, value) => total + value);
    }
    const xySum = sum(xy);
    const slope = xySum / sum(xMinusxMeanSq);
    const slopeStart = yMean - slope * xMean;
    console.log(type, slopeStart + slope * xData[0] - 1, slopeStart + slope * xData[xData.length -1] + 4);

    return {
      slope: slope,
      slopeStart: slopeStart,
      calcY: (x) => slopeStart + slope * x,
      xStart: xData[0] - 1,
      xEnd: xData[xData.length - 1] + 4,
    };
  }

  if (props.type === "allRuns") {
    const chartData = chartDataGetter();
    const durationTrend = trendLine(chartData, "duration");
    const distanceTrend = trendLine(chartData, "distance");
    const speedTrend = trendLine(chartData, "speed");
    const heartRateTrend = trendLine(chartData, "heartRate");
    function chartDataGetter() {
      let holder = [];
      props.dateRange.forEach((date) => {
        let runOnDate = props.runs.find((run) => run.render.date === date);
        if (runOnDate) {
          holder.push({
            id: runOnDate.id,
            date: date[0] + date[1],
            duration: objectToMs(runOnDate.duration),
            distance: runOnDate.distance,
            speed: runOnDate.speed,
            heartRate: runOnDate.heartRate,
          });
        } else {
          holder.push({
            id: null,
            date: date[0] + date[1],
          });
        }
      });
      return holder;
    }
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
            <YAxis yAxisId="duration" domain={[0, "dataMax + 300000"]} hide  />
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
            <ReferenceLine
              yAxisId="duration"
              segment={[
                {
                  x: durationTrend.xStart,
                  y: durationTrend.calcY(durationTrend.xStart),
                },
                {
                  x: durationTrend.xEnd,
                  y: durationTrend.calcY(durationTrend.xEnd),
                },
              ]}
              stroke={props.durationColor}
            />
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
            <ReferenceLine
              yAxisId="distance"
              segment={[
                {
                  x: distanceTrend.xStart,
                  y: distanceTrend.calcY(distanceTrend.xStart),
                },
                {
                  x: distanceTrend.xEnd,
                  y: distanceTrend.calcY(distanceTrend.xEnd),
                },
              ]}
              stroke={props.distanceColor}
            />
            <YAxis yAxisId="speed" domain={[0, "dataMax + 4"]}  hide />
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
            <ReferenceLine
              yAxisId="speed"
              segment={[
                {
                  x: speedTrend.xStart,
                  y: speedTrend.calcY(speedTrend.xStart),
                },
                {
                  x: speedTrend.xEnd,
                  y: speedTrend.calcY(speedTrend.xEnd),
                },
              ]}
              stroke={props.speedColor}
            />
            <YAxis yAxisId="heartRate" domain={[0, "dataMax + 40"]}  hide />
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
            <ReferenceLine
              yAxisId="heartRate"
              segment={[
                {
                  x: heartRateTrend.xStart,
                  y: heartRateTrend.calcY(heartRateTrend.xStart),
                },
                {
                  x: heartRateTrend.xEnd,
                  y: heartRateTrend.calcY(heartRateTrend.xEnd),
                },
              ]}
              stroke={props.heartRateColor}
            />
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
              dataKey="Other"
              stroke="hotPink"
              strokeWidth={2}
              dot={<DotRender />}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Fat Burn"
              stroke="green"
              strokeWidth={2}
              dot={<DotRender />}
            />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="Cardio"
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

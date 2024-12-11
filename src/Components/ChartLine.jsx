import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
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
      color = "red";
    }
    return <circle r="4" cx={payload.cx} cy={payload.cy} fill={color}></circle>;
  }

  function TooltipContent({ payload }) {
    if (payload[0]) {
      if (payload[0].dataKey === "bpm") {
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

  function dateRangeChangeButton(amount) {
    props.dateRangeChange.current = amount;
    props.setDateRange(dateArrayToRender(amount, props.baselineDate));
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
  if (props.type === "allRuns") {
    const chartData = chartDataGetter();
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
    return (
      <div className="graphHolder" id={"allRunsGraph"}>
        <div className="graphTop">
          <p className="graphTitle">{props.render}</p>
          <div className="graphDateHolder">
            <p
              onClick={() => {
                dateRangeChangeButton(6);
              }}
              style={
                props.dateRangeChange.current === 6
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
              W
            </p>
            <p
              onClick={() => {
                dateRangeChangeButton(31);
              }}
              style={
                props.dateRangeChange.current === 31
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
              M
            </p>
            <p
              onClick={() => {
                dateRangeChangeButton(365);
              }}
              style={
                props.dateRangeChange.current === 365
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
              Y
            </p>
            <p
              onClick={() => {
                dateRangeShiftButton("left");
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {"<-"}
            </p>
            <p>
              {props.dateRange[0] +
                " - " +
                props.dateRange[props.dateRangeChange.current]}
            </p>
            <p
              onClick={() => {
                dateRangeShiftButton("right");
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {"->"}
            </p>
          </div>
        </div>
        <ResponsiveContainer>
          <LineChart margin={{ top: 20, left: 20, right: 20 }} data={chartData}>
            <CartesianGrid strokeDasharray="5 20" vertical={false} />
            <Legend />
            <XAxis dataKey="date" dy={5} />
            <YAxis yAxisId="duration" hide />
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
              connectNulls
            />
            <YAxis yAxisId="distance" hide />
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
              connectNulls
            />
            <YAxis yAxisId="speed" hide />
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
              connectNulls
            />
            <YAxis yAxisId="heartRate" hide />
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
              connectNulls
            />
            <Tooltip content={<TooltipContent />} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (props.type === "selected") {
    const chartData = props.runs[props.activeRun].heartRateArray;
    return (
      <div className="graphHolder" id={"selectedGraph"}>
        <div className="graphTop">
          <p className="graphTitle">
            {props.render} - {props.runs[props.activeRun].render.date}
          </p>
        </div>
        <ResponsiveContainer>
          <LineChart margin={{ top: 20, left: 20, right: 20 }} data={chartData}>
            <CartesianGrid strokeDasharray="5 20" vertical={false} />
            <Legend />
            <XAxis dataKey="time" padding={{ left: 10 }} dy={7} hide />
            <YAxis yAxisId="bpm" hide />
            <Line
              yAxisId="bpm"
              isAnimationActive={false}
              dataKey="bpm"
              stroke="green"
              strokeWidth={2}
              dot={
                <DotRender
                  color="green"
                  runs={props.runs}
                  activeRun={props.activeRun}
                />
              }
              connectNulls
            />
            <Tooltip content={<TooltipContent />} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

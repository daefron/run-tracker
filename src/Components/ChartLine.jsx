import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { objectToMs, dateArrayToRender } from "../Tools.jsx";
export function ChartLine(props) {
  if (!props.runs) {
    return;
  }
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
        });
      } else {
        holder.push({
          id: null,
          date: date[0] + date[1],
          duration: null,
          distance: null,
        });
      }
    });
    return holder;
  }

  function DotRender({ payload, cx, cy }) {
    if (payload.id === null) {
      return;
    }
    let color = props.lineColor;
    if (payload.id === props.runs[props.activeRun].id) {
      color = "red";
    }
    return <circle r="4" cx={cx} cy={cy} fill={color}></circle>;
  }

  function TooltipContent({ payload }) {
    if (payload[0]) {
      let currentRun = props.runs.find(
        (run) => run.id === payload[0].payload.id
      );
      return (
        <>
          <p>Date: {currentRun.render.date}</p>
          <p>Duration: {currentRun.render.duration}</p>
          <p>Distance: {currentRun.render.distance}</p>
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

  return (
    <>
      <div className="graphHolder" id={props.yAxis + "Graph"}>
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
        <ResponsiveContainer minWidth={500} aspect={3}>
          <LineChart margin={{ top: 20, left: 20, right: 20 }} data={chartData}>
            <CartesianGrid strokeDasharray="5 20" vertical={false} />
            <XAxis
              dataKey={props.xAxis}
              tickFormatter={props.xAxisFormatter}
              unit={props.xAxisUnit}
              padding={{ left: 10 }}
              dy={7}
              ticks={0}
            />
            <YAxis
              dataKey={props.yAxis}
              tickFormatter={props.yAxisFormatter}
              unit={props.yAxisUnit}
              dx={-4}
            />
            <Line
              type="linear"
              isAnimationActive={false}
              dataKey={props.yAxis}
              stroke={props.lineColor}
              strokeWidth={2}
              dot={<DotRender />}
              connectNulls
            />
            <Tooltip content={<TooltipContent />} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

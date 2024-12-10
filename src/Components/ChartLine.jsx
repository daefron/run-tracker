import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { objectToMs } from "../Tools.jsx";
export function ChartLine(props) {
  const chartData = chartDataGetter();
  function chartDataGetter() {
    let holder = [];
    props.runs.forEach((run) => {
      holder.push({
        id: run.id,
        date: run.render.date,
        duration: objectToMs(run.duration),
        distance: run.distance,
      });
    });
    return holder;
  }

  function DotTest({ payload, cx, cy }) {
    let color = "blue";
    if (payload.id === props.runs[props.activeRun].id) {
      color = "red";
    }
    return <circle r="3" cx={cx} cy={cy} fill={color}></circle>;
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
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart margin={{ top: 20, left: 20, right: 40 }} data={chartData}>
        <XAxis
          dataKey={props.xAxis}
          tickFormatter={props.xAxisFormatter}
          unit={props.xAxisUnit}
          padding={{ left: 10 }}
          dy={7}
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
          stroke="#8884d8"
          strokeWidth={2}
          dot={<DotTest />}
        />
        <Tooltip content={<TooltipContent />} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

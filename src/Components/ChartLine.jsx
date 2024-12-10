import { LineChart, Line, XAxis, YAxis } from "recharts";
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

  return (
    <LineChart width={600} height={400} data={chartData}>
      <XAxis
        dataKey={props.xAxis}
        tickFormatter={props.xAxisFormatter}
        unit={props.xAxisUnit}
      />
      <YAxis
        dataKey={props.yAxis}
        tickFormatter={props.yAxisFormatter}
        unit={props.yAxisUnit}
      />
      <Line
        type="linear"
        isAnimationActive={false}
        dataKey={props.yAxis}
        stroke="#8884d8"
        strokeWidth={2}
        dot={<DotTest />}
      />
    </LineChart>
  );
}

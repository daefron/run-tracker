import { LineChart, Line, XAxis, YAxis } from "recharts";
import { objectToMs } from "../Tools.jsx";
export function ChartLine(props) {
  const chartData = chartDataGetter();
  function chartDataGetter() {
    let holder = [];
    props.runs.forEach((run) => {
      holder.push({
        date: run.render.date,
        duration: objectToMs(run.duration),
        distance: run.distance,
      });
    });
    return holder;
  }
  
  return (
    <LineChart width={600} height={400} data={chartData}>
      <XAxis
        dataKey={props.xAxis}
        tickFormatter={props.xAxisFormatter}
        unit={props.xAxisUnit}
      ></XAxis>
      <YAxis
        dataKey={props.yAxis}
        tickFormatter={props.yAxisFormatter}
        unit={props.yAxisUnit}
      ></YAxis>
      <Line
        type="linear"
        isAnimationActive={false}
        dataKey={props.yAxis}
        stroke="#8884d8"
        strokeWidth={2}
      ></Line>
    </LineChart>
  );
}

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { objectToMs } from "../Tools.jsx";
import { useState, useRef } from "react";
export function ChartLine(props) {
  const currentDate = new Date();
  function dayArray(length) {
    let days = [];
    const currentDay = baselineDate.current.getDate();
    const currentMonth = baselineDate.current.getMonth();
    const currentYear = baselineDate.current.getFullYear();
    for (let i = length; i >= 0; i--) {
      let newDay = new Date(currentYear, currentMonth, currentDay - i);
      days.push(newDay);
    }
    return days;
  }

  const dateRangeAmount = useRef(20);
  const baselineDate = useRef(currentDate);
  const [dateRange, setDateRange] = useState(
    dateArrayToRender(dayArray(dateRangeAmount.current))
  );

  function dateParser(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return [day, month, year];
  }

  function dateArrayToRender(array) {
    let holder = [];
    array.forEach((date) => {
      let separatedDate = dateParser(date);
      separatedDate[1] += 1;
      let holder2 = [];
      separatedDate.forEach((digit) => {
        if (digit.toString().length < 2) {
          digit = "0" + digit;
        } else digit = digit.toString();
        holder2.push(digit);
      });
      let parsedDate =
        holder2[0] + "/" + holder2[1] + "/" + holder2[2][2] + holder2[2][3];
      holder.push(parsedDate);
    });
    return holder;
  }

  const chartData = chartDataGetter();
  function chartDataGetter() {
    let holder = [];
    dateRange.forEach((date) => {
      let runOnDate = props.runs.find((run) => run.render.date === date);
      if (runOnDate) {
        holder.push({
          id: runOnDate.id,
          date: date[0]+date[1],
          duration: objectToMs(runOnDate.duration),
          distance: runOnDate.distance,
        });
      } else {
        holder.push({
          id: null,
          date: date[0]+date[1],
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
  return (
    <ResponsiveContainer minWidth={500} aspect={3}>
      <LineChart margin={{ top: 20, left: 20, right: 40 }} data={chartData}>
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
  );
}

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  Legend,
  ReferenceLine,
  Tooltip,
} from "recharts";
export function SelectedChart(props) {
  function gridMaker(dimension, divider) {
    let array = [];
    for (let i = 20; i < dimension; i += dimension / divider) {
      array.push(i);
    }
    return array;
  }
  function TooltipContent({ payload }) {
    if (payload[0]) {
      return (
        <>
          <p>Time: {payload[0].payload.time}</p>
          <p>BPM: {payload[0].payload.bpm}</p>
        </>
      );
    }
  }

  const chartData = bpmChartData(props.runs[props.activeRun].heartRateArray);
  const zones = zoneGetter(props.runs[props.activeRun].heartRateZones);
  function zoneGetter(data) {
    let parsedData = {};
    data.forEach((value) => {
      parsedData[value.name] = value.min;
    });
    return parsedData;
  }
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
          <CartesianGrid
            stroke="rgba(255, 255, 255, 0.1)"
            horizontalCoordinatesGenerator={(props) =>
              gridMaker(props.height, 10)
            }
            verticalCoordinatesGenerator={(props) => gridMaker(props.width, 10)}
          />
          <Line
            yAxisId="bpm"
            isAnimationActive={false}
            dataKey="Light"
            stroke="hotPink"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="bpm"
            isAnimationActive={false}
            dataKey="Moderate"
            stroke="green"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine
            yAxisId="bpm"
            strokeWidth={1}
            stroke="green"
            y={zones.Moderate}
          />
          <Line
            yAxisId="bpm"
            isAnimationActive={false}
            dataKey="Vigorous"
            stroke="yellow"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine
            yAxisId="bpm"
            strokeWidth={1}
            stroke="yellow"
            y={zones.Vigorous}
          />
          <Line
            yAxisId="bpm"
            isAnimationActive={false}
            dataKey="Peak"
            stroke="red"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine
            yAxisId="bpm"
            strokeWidth={1}
            stroke="red"
            y={zones.Peak}
          />
          <Legend />
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

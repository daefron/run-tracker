import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
export function ChartPie(props) {
  if (!props.runs) {
    return;
  }
  const pieData = dataGetter(props.runs[props.activeRun]);
  function dataGetter(run) {
    if (props.type === "heartZones") {
      return [
        {
          name: "moderate",
          value: run.heartRateZones[1].minutes,
        },
        {
          name: "vigorous",
          value: run.heartRateZones[2].minutes,
        },
        {
          name: "peak",
          value: run.heartRateZones[3].minutes,
        },
      ];
    }
    if (props.type === "activeTime") {
      return [
        {
          name: "active",
          value: Math.round(run.activeDuration / 60000),
        },
        {
          name: "inactive",
          value: Math.round(run.inactiveDuration / 60000),
        },
      ];
    }
  }
  function TooltipContent({ payload }) {
    if (payload[0]) {
      return (
        <p>
          {payload[0].name}: {payload[0].value} mins
        </p>
      );
    }
  }
  const colors = ["green", "yellow", "red"];
  return (
    <div className="pieHolder" id={props.type + "Pie"}>
      <div className="graphTop">
        <p className="graphTitle">{props.render}</p>
      </div>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius="70%"
            outerRadius="90%"
            startAngle={210}
            endAngle={-30}
            paddingAngle={5}
            isAnimationActive={false}
            strokeWidth={0}
          >
            {pieData.map((entry, index) => (
              <Cell key={"cell" + index} fill={colors[index]} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ top: "70%" }} />
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

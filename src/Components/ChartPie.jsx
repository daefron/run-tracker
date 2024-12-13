import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
export function ChartPie(props) {
  if (!props.runs) {
    return;
  }
  const pieData = dataGetter(props.runs[props.activeRun]);
  function dataGetter(run) {
    if (props.type === "heartZones") {
      return [
        { name: "fatBurn", value: run.heartRateZones[1].minutes },
        { name: "cardio", value: run.heartRateZones[2].minutes },
        { name: "peak", value: run.heartRateZones[3].minutes },
      ];
    }
    if (props.type === "activeTime") {
      return [
        { name: "active", value: run.activeDuration / 1000 },
        { name: "inactive", value: run.inactiveDuration / 1000 },
      ];
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
            innerRadius="58%"
            outerRadius="75%"
            startAngle={210}
            endAngle={-30}
            paddingAngle={5}
            label
            isAnimationActive={false}
            strokeWidth={0}
          >
            {pieData.map((entry, index) => (
              <Cell key={"cell" + index} fill={colors[index]} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ top: "70%" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

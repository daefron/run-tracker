import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
export function ChartPie({ runs, activeRun, type, render }) {
  const pieData = dataGetter(runs[activeRun]);
  let colors;
  if (type === "activeTime") {
    colors = ["green", "red"];
  }
  if (type === "heartZones") {
    colors = ["pink", "green", "yellow", "red"];
  }
  function dataGetter(run) {
    if (type === "heartZones") {
      return [
        {
          name: "light",
          value: run.heartRateZones[0].minutes,
        },
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
    if (type === "activeTime") {
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
        <p className="smallFont">
          {payload[0].name}: {payload[0].value} mins
        </p>
      );
    }
  }
  return (
    <div className="pieHolder" id={type + "Pie"}>
      <div className="elementHeader">
        <p className="titleFont">{render}</p>
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
            animationBegin={0}
            animationDuration={300}
            strokeWidth={0}
          >
            {pieData.map((entry, index) => (
              <Cell key={"cell" + index} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip content={<TooltipContent />} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

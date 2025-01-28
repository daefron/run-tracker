export function OverallStats({ overallStats }) {
  function Average({ unit, data }) {
    return (
      <div className="listItem" id={"average" + unit}>
        <p className="statTitle smallFont">Average {unit}: </p>
        <p className="statContent smallFont">{data}</p>
      </div>
    );
  }

  function Total({ unit, data }) {
    return (
      <div className="listItem" id={"average" + unit}>
        <p className="statTitle smallFont">Total {unit}: </p>
        <p className="statContent smallFont">{data}</p>
      </div>
    );
  }

  function Highest({ unit, data }) {
    return (
      <div className="listItem" id={"highest" + unit}>
        <p className="statTitle smallFont">Highest {unit}:</p>
        <p className="statContent smallFont">{data}</p>
      </div>
    );
  }

  return (
    <div id="overallStats">
      <p id="overallStatsTitle" className="titleFont elementHeader">
        Overall stats
      </p>
      <Total unit="runs" data={overallStats.total.runs} />
      <Total unit="distance" data={overallStats.total.distance} />
      <Average unit="distance" data={overallStats.average.distance} />
      <Highest unit="distance" data={overallStats.highest.distance} />
      <Total unit="duration" data={overallStats.total.duration} />
      <Average unit="duration" data={overallStats.average.duration} />
      <Highest unit="duration" data={overallStats.highest.duration} />
      <Average unit="speed" data={overallStats.average.speed} />
      <Highest unit="speed" data={overallStats.highest.speed} />
      <Average unit="heartRate" data={overallStats.average.heartRate} />
    </div>
  );
}

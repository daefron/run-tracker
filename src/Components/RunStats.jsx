export function RunStats(props) {
  let run = props.runs[props.activeRun];
  return (
    <div id="runStats">
      <p id="runStatsTitle">Selected run stats</p>
      <div className="runStat">
        <p className="statTitle">Date: </p>
        <p className="statContent">{run.render.date}</p>
      </div>
      <div className="runStat">
        <p className="statTitle">Start time: </p>
        <p className="statContent">{run.render.startTime}</p>
      </div>
      <div className="runStat">
        <p className="statTitle">Duration: </p>
        <p className="statContent">{run.render.duration}</p>
      </div>
      <div className="runStat">
        <p className="statTitle">Distance: </p>
        <p className="statContent">{run.render.distance}</p>
      </div>
      <div className="runStat">
        <p className="statTitle">Average speed: </p>
        <p className="statContent">{run.speed.toFixed(2) + " km/h"}</p>
      </div>
      <div className="runStat">
        <p className="statTitle">Steps: </p>
        <p className="statContent">{run.steps}</p>
      </div>
      <div className="runStat">
        <p className="statTitle">Calories: </p>
        <p className="statContent">{run.calories}</p>
      </div>
    </div>
  );
}

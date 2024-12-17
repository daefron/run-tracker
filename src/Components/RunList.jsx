export function RunList({
  runs,
  activeRun,
  setActiveRun,
  hoverRun,
  setHoverRun,
}) {
  if (!runs) {
    return;
  }
  return (
    <div id="runList">
      <div id="listTitle">
        <p className="titleFont">Date</p>
        <p className="titleFont">Start Time</p>
        <p className="titleFont">Duration</p>
        <p className="titleFont">Length</p>
      </div>
      <div id="runListItems">
        {runs.map((run) => {
          return (
            <RunItem
              key={run.date + run.index}
              data={run}
              activeRun={activeRun}
              setActiveRun={setActiveRun}
              hoverRun={hoverRun}
              setHoverRun={setHoverRun}
            ></RunItem>
          );
        })}
      </div>
    </div>
  );
}

function RunItem({ activeRun, hoverRun, setActiveRun, setHoverRun, data }) {
  return (
    <div
      className="runItem"
      style={
        activeRun === data.index
          ? hoverRun === data.index
            ? {
                backgroundColor: "rgb(40, 40, 90)",
              }
            : {
                backgroundColor: "rgb(37, 36, 85)",
              }
          : hoverRun === data.index
          ? {
              backgroundColor: "rgb(55, 55, 75)",
            }
          : {
              backgroundColor: "rgb(50, 50, 70)",
            }
      }
      onClick={() => {
        setActiveRun(data.index);
      }}
      onMouseOver={() => {
        setHoverRun(data.index);
      }}
    >
      <RunItemStat
        type="date"
        data={data}
        setActiveRun={setActiveRun}
      ></RunItemStat>
      <RunItemStat
        type="startTime"
        data={data}
        setActiveRun={setActiveRun}
      ></RunItemStat>
      <div className="diffStat">
        <RunItemStat
          type="duration"
          diffOriginal={true}
          data={data}
          setActiveRun={setActiveRun}
        ></RunItemStat>
        <RunItemStat
          type="duration"
          diff={true}
          data={data}
          setActiveRun={setActiveRun}
        ></RunItemStat>
      </div>
      <div className="diffStat">
        <RunItemStat
          type="distance"
          diffOriginal={true}
          data={data}
          setActiveRun={setActiveRun}
        ></RunItemStat>
        <RunItemStat
          type="distance"
          diff={true}
          data={data}
          setActiveRun={setActiveRun}
        ></RunItemStat>
      </div>
    </div>
  );
}

function RunItemStat({ type, data, setActiveRun, diff, diffOriginal }) {
  let content = data.render[type];
  let statStyle = {};
  let statClassName = "smallFont";
  if (diff) {
    statClassName += " diffStatDiff";
    content = data.render[type + "Diff"];
    if (data[type + "Negative"]) {
      statStyle.color = "Red";
    } else statStyle.color = "Green";
  } else if (diffOriginal) {
    statClassName += " diffStatOriginal";
  }
  return (
    <>
      <p
        className={statClassName}
        style={statStyle}
        onClick={() => {
          setActiveRun(data.index);
        }}
      >
        {content}
      </p>
    </>
  );
}

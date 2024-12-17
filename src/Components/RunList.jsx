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
        <p className="titleFont" style={{ width: "20%" }}>
          Date
        </p>
        <p className="titleFont" style={{ width: "20%" }}>
          Start Time
        </p>
        <p className="titleFont" style={{ width: "30%" }}>
          Duration
        </p>
        <p className="titleFont" style={{ width: "30%" }}>
          Length
        </p>
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
        size="20%"
      ></RunItemStat>
      <RunItemStat
        type="startTime"
        data={data}
        setActiveRun={setActiveRun}
        size="20%"
      ></RunItemStat>
      <div className="diffStat" style={{ width: "30%" }}>
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
      <div className="diffStat" style={{ width: "30%" }}>
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

function RunItemStat({ type, data, setActiveRun, diff, diffOriginal, size }) {
  let content = data.render[type];
  let statStyle = {};
  let statClassName = "smallFont";
  if (size) {
    statStyle.width = size;
  }
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

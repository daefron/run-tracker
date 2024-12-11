export function RunList(props) {
  if (!props.runs) {
    return;
  }
  return (
    <div id="runList">
      <div id="listTitle">
        <p>Date</p>
        <p>Start Time</p>
        <div className="diffStat">
          <p>Duration</p>
          <p></p>
        </div>
        <div className="diffStat">
          <p>Length</p>
          <p></p>
        </div>
      </div>
      <div id="runListItems">
        {props.runs.map((run) => {
          return (
            <RunItem
              key={run.date + run.index}
              data={run}
              activeRun={props.activeRun}
              setActiveRun={props.setActiveRun}
              hoverRun={props.hoverRun}
              setHoverRun={props.setHoverRun}
            ></RunItem>
          );
        })}
      </div>
    </div>
  );
}

function RunItem(props) {
  return (
    <div
      className="runItem"
      style={
        props.activeRun === props.data.index
          ? props.hoverRun === props.data.index
            ? {
                backgroundColor: "rgb(40, 40, 90)",
              }
            : {
                backgroundColor: "rgb(37, 36, 85)",
              }
          : props.hoverRun === props.data.index
          ? {
              backgroundColor: "rgb(55, 55, 75)",
            }
          : {
              backgroundColor: "rgb(50, 50, 70)",
            }
      }
      onClick={() => {
        props.setActiveRun(props.data.index);
      }}
      onMouseOver={() => {
        props.setHoverRun(props.data.index);
      }}
    >
      <RunItemStat
        type="date"
        data={props.data}
        setActiveRun={props.setActiveRun}
      ></RunItemStat>
      <RunItemStat
        type="startTime"
        data={props.data}
        setActiveRun={props.setActiveRun}
      ></RunItemStat>
      <div className="diffStat">
        <RunItemStat
          type="duration"
          data={props.data}
          setActiveRun={props.setActiveRun}
        ></RunItemStat>
        <RunItemStat
          type="duration"
          diff={true}
          data={props.data}
          setActiveRun={props.setActiveRun}
        ></RunItemStat>
      </div>
      <div className="diffStat">
        <RunItemStat
          type="distance"
          data={props.data}
          setActiveRun={props.setActiveRun}
        ></RunItemStat>
        <RunItemStat
          type="distance"
          diff={true}
          data={props.data}
          setActiveRun={props.setActiveRun}
        ></RunItemStat>
      </div>
    </div>
  );
}

function RunItemStat(props) {
  let content = props.data.render[props.type];
  let statStyle = {};
  if (props.diff) {
    statStyle.width = "30%";
    content = props.data.render[props.type + "Diff"];
    if (props.data[props.type + "Negative"]) {
      statStyle.color = "Red";
    } else statStyle.color = "Green";
  }
  return (
    <>
      <p
        style={statStyle}
        onClick={() => {
          props.setActiveRun(props.data.index);
        }}
      >
        {content}
      </p>
    </>
  );
}

export function RunList(props) {
  return (
    <div id="runList">
      {props.runs.map((run) => {
        return (
          <RunItem
            key={run.date + run.index}
            data={run}
            activeItem={props.activeItem}
            setActiveItem={props.setActiveItem}
          ></RunItem>
        );
      })}
    </div>
  );
}

function RunItem(props) {
  return (
    <div
      className="runItem"
      style={
        props.activeItem === props.data.index
          ? {
              backgroundColor: "rgb(37, 36, 85)",
            }
          : {
              backgroundColor: "rgb(17, 16, 66)",
            }
      }
      onClick={() => {
        props.setActiveItem(props.data.index);
      }}
    >
      <RunItemStat
        type="date"
        data={props.data}
        setActiveItem={props.setActiveItem}
      ></RunItemStat>
      <RunItemStat
        type="startTime"
        data={props.data}
        setActiveItem={props.setActiveItem}
      ></RunItemStat>
      <RunItemStat
        type="duration"
        data={props.data}
        setActiveItem={props.setActiveItem}
      ></RunItemStat>
      <RunItemStat
        type="duration"
        diff={true}
        data={props.data}
        setActiveItem={props.setActiveItem}
      ></RunItemStat>
      <RunItemStat
        type="distance"
        data={props.data}
        setActiveItem={props.setActiveItem}
      ></RunItemStat>
      <RunItemStat
        type="distance"
        diff={true}
        data={props.data}
        setActiveItem={props.setActiveItem}
      ></RunItemStat>
    </div>
  );
}

function RunItemStat(props) {
  let content = props.data.render[props.type];
  let statStyle = {};
  if (props.diff) {
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
          props.setActiveItem(props.data.index);
        }}
      >
        {content}
      </p>
    </>
  );
}
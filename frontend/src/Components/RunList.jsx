export function RunList({
  runs,
  activeRun,
  setActiveRun,
  hoverRun,
  setHoverRun,
  brushStart,
  brushEnd,
}) {
  return (
    <div id="runList">
      <div className="elementHeader runItem runListTitle">
        <p className="titleFont" style={{ width: "5%" }}>
          GPS
        </p>
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
          Length &nbsp; &nbsp; &nbsp;
        </p>
      </div>
      <div id="runListItems">
        {runs.map((run) => {
          let inBrush;
          if (run.chartOrder >= brushStart && run.chartOrder <= brushEnd) {
            inBrush = true;
          }
          return (
            <RunItem
              key={run.render.date + run.index}
              data={run}
              activeRun={activeRun}
              setActiveRun={setActiveRun}
              hoverRun={hoverRun}
              setHoverRun={setHoverRun}
              inBrush={inBrush}
            ></RunItem>
          );
        })}
      </div>
    </div>
  );
}

function RunItem({
  activeRun,
  hoverRun,
  setActiveRun,
  setHoverRun,
  data,
  inBrush,
}) {
  return (
    <div
      className="runItem"
      style={
        inBrush
          ? activeRun === data.index
            ? hoverRun === data.index
              ? {
                  backgroundColor: "rgb(45, 45, 95)",
                }
              : {
                  backgroundColor: "rgb(42, 41, 90)",
                }
            : hoverRun === data.index
            ? {
                backgroundColor: "rgb(60, 60, 80)",
              }
            : {
                backgroundColor: "rgb(55, 55, 75)",
              }
          : activeRun === data.index
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
      onMouseOut={() => {
        setHoverRun(false);
      }}
    >
      {data.render.GPS === "Connected" ? (
        <svg
          className="GPSSymbol"
          style={{ paddingRight: "1%" }}
          width="7%"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.34835 14.6517C7.88388 13.1872 7.88388 10.8128 9.34835 9.34835M14.6517 9.34835C16.1161 10.8128 16.1161 13.1872 14.6517 14.6517M7.22703 16.773C4.59099 14.1369 4.59099 9.86307 7.22703 7.22703M16.773 7.22703C19.409 9.86307 19.409 14.1369 16.773 16.773M5.10571 18.8943C1.2981 15.0867 1.2981 8.91333 5.10571 5.10571M18.8943 5.10571C22.7019 8.91333 22.7019 15.0867 18.8943 18.8943M12 12H12.0075V12.0075H12V12ZM12.375 12C12.375 12.2071 12.2071 12.375 12 12.375C11.7929 12.375 11.625 12.2071 11.625 12C11.625 11.7929 11.7929 11.625 12 11.625C12.2071 11.625 12.375 11.7929 12.375 12Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <>
          <div style={{ width: "8%" }}></div>
        </>
      )}
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
      <div style={{ width: "30%" }}>
        <RunItemStat
          type="duration"
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
      <div style={{ width: "30%" }}>
        <RunItemStat
          type="distance"
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

function RunItemStat({ type, data, setActiveRun, diff, size }) {
  let content = data.render[type];
  let statStyle = {};
  let statClassName = "smallFont";
  if (size) {
    statStyle.width = size;
  }
  if (diff) {
    statClassName += " diff";
    content = data.render[type + "Diff"];
    if (data[type + "Negative"]) {
      statStyle.color = "Red";
    } else statStyle.color = "Green";
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

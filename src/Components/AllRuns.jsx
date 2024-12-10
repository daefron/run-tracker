export function AllRuns(props) {
  return (
    <>
      <p
        id="allRuns"
        style={
          props.activeRun === "allRuns"
            ? {
                backgroundColor: "rgb(37, 36, 85)",
              }
            : {
                backgroundColor: "rgb(50, 50, 70)",
              }
        }
        onClick={() => {
          props.setActiveRun("allRuns");
        }}
      >
        All runs
      </p>
    </>
  );
}

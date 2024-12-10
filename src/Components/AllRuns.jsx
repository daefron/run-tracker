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
                backgroundColor: "rgb(17, 16, 66)",
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

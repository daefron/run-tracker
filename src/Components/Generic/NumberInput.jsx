export function NumberIncrementor({ type, state, setState, text, runs }) {
  function incrementUp() {
    if (state + 1 <= runs.length) {
      setState(state + 1);
    }
  }
  function incrementDown() {
    if (state - 1 >= 2) {
      setState(state - 1);
    }
  }
  return (
    <div style={{ display: "flex", gap: "5px" }} id={type + "Incrementor"}>
      <p className="smallFont">{text}</p>
      <p
        className="smallFont"
        onClick={incrementDown}
        style={state - 1 < 2 ? { color: "dimGrey" } : { color: "white" }}
      >
        -
      </p>
      <p className="smallFont">{state}</p>
      <p
        className="smallFont"
        onClick={incrementUp}
        style={
          state + 1 > runs.length ? { color: "dimGrey" } : { color: "white" }
        }
      >
        +
      </p>
    </div>
  );
}

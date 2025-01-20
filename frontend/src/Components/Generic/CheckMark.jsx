export function CheckMark({ type, state, setState, text }) {
  return (
    <>
      <label key={type + "checkHolder"} className="checkHolder smallFont">
        <input
          id={type + "CheckMark"}
          name={type}
          type="checkbox"
          defaultChecked={state}
          value={state}
          onChange={() => {
            setState(!state);
          }}
        />
        {text}
      </label>
    </>
  );
}

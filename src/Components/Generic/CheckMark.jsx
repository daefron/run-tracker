export function CheckMark({ type, classRender, state, setState, text }) {
  return (
    <>
      <label key={type + "checkHolder"} className={classRender + "CheckHolder"}>
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

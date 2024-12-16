export function CheckMark(props) {
  return (
    <>
      <label
        key={props.type + "checkHolder"}
        className={props.class + "CheckHolder"}
      >
        <input
          id={props.type + "CheckMark"}
          name={props.type}
          type="checkbox"
          defaultChecked={props.state}
          value={props.state}
          onChange={() => {
            props.setState(!props.state);
          }}
        />
        {props.text}
      </label>
    </>
  );
}
export function Stats(props) {
  return (
    <>
      {props.types.map((type) => {
        return <Stat key={type + props.run.id} type={type} run={props.run} />;
      })}
    </>
  );
  function Stat(props) {
    const type = props.type;
    return (
      <div className="runStat">
        <p className="statTitle">
          {type.charAt(0).toUpperCase() + type.slice(1)}:
        </p>
        <p className="statContent">{props.run.render[type]}</p>
      </div>
    );
  }
}
export function Stats({ run, types }) {
  return (
    <>
      {types.map((type) => {
        return <Stat key={type + run.id} type={type} run={run} />;
      })}
    </>
  );
  function Stat({ type, run }) {
    return (
      <div className="listItem">
        <p className="statTitle smallFont">
          {type.charAt(0).toUpperCase() + type.slice(1)}:
        </p>
        <p className="statContent smallFont">{run.render[type]}</p>
      </div>
    );
  }
}

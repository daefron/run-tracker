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
      <div className="runStat">
        <p className="statTitle">
          {type.charAt(0).toUpperCase() + type.slice(1)}:
        </p>
        <p className="statContent">{run.render[type]}</p>
      </div>
    );
  }
}

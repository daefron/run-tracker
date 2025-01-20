export function LastUpdated({ lastUpdated }) {
  const timeNow = Date.now();
  let lastUpdatedd = Number(lastUpdated) - 4000000;
  const timeDiff = timeNow - Number(lastUpdatedd);
  let newTime = parseInt(timeDiff / 1000 / 60);
  if (newTime > 60) {
    newTime =
      parseInt(newTime / 60) +
      " hours and " +
      parseInt(newTime - 60 * parseInt(newTime / 60));
  }
  return (
    <>
      <p className="smallFont" id="lastUpdated">
        Last updated: {newTime} minutes ago
      </p>
    </>
  );
}

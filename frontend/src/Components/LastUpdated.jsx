export function LastUpdated({ lastUpdated, setLoading, setLastUpdated }) {
  const timeNow = Date.now();
  const timeDiff = timeNow - Number(lastUpdated);
  let newTime = parseInt(timeDiff / 1000 / 60);
  if (newTime > 60) {
    newTime =
      parseInt(newTime / 60) +
      " hours and " +
      parseInt(newTime - 60 * parseInt(newTime / 60));
  }
  async function refreshPage() {
    setLoading(true);
    fetch("https://run-tracker-r3vq.onrender.com/update", {
      headers: {
        "Content-Type": "text/html",
      },
      method: "GET",
    }).then((res) => {
      setLastUpdated(Date.now());
      setLoading(false);
      return;
    });
  }
  return (
    <>
      <div
        id="lastUpdated"
        style={{ display: "flex", gap: 5 }}
        onClick={refreshPage}
      >
        <svg width="18" height="20" viewBox="0 -960 960 960" fill="white">
          <path d="M480-160q-134 0-227-93t-93-227 93-227 227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170 70 170 170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67" />
        </svg>
        <p className="smallFont">Last updated: {newTime} minutes ago</p>
      </div>
    </>
  );
}

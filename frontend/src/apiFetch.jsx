export async function apiFetch(setRuns, setLoading, setLastUpdated) {
  fetch("https://run-tracker-r3vq.onrender.com/data", {
    headers: {
      "Content-Type": "text/html",
    },
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      setRuns(res.data);
      setLastUpdated(res.lastUpdated);
      setLoading(false);
    });
}

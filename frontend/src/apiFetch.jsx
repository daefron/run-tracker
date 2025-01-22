export async function apiFetch(setRuns, setLoading, setLastUpdated) {
  fetch("https://surviving-maurizia-thomasevans-e62ca6c2.koyeb.app/", {
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

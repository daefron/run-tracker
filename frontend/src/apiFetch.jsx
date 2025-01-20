export async function apiFetch(setRuns, setLoading, setLastUpdated) {
  fetch(process.env.SERVER_URL + "/data", {
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

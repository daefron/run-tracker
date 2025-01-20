export async function apiFetch(setRuns, setLoading) {
  fetch("http://localhost:3000/data", {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000/",
      "Content-Type": "text/html",
    },
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      setRuns(res.data);
      setLoading(false);
    });
}

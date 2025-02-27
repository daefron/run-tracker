export async function apiFetch(setData, setLoading) {
  fetch("https://surviving-maurizia-thomasevans-e62ca6c2.koyeb.app/data", {
    headers: {
      "Content-Type": "text/html",
    },
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      setData(res);
      setLoading(false);
    });
}

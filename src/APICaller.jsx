export function apiCall() {
  const data = {
    key: "23PZCT",
    secret: "395d7ddec6dd2384c79bda6d6a1cce29",
    codeVerifier:
      "5a2y1k4b6m5o6k4f3r091b48526x6307275i0b5u3p513o3l1d3g193z6k6y2e0x4k093u5r3w4l6u1e166z4k6r6q6q2l26666f1j593m146v4z312410362v421c0o",
    codeChallenge: "oXFDEsd0T13Be7bG4VQgakfkeeJHpp6EWx4_wYDojPo",
    state: "3g705j2b6i425b220164703r5l3b2p13",
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJwcm8iLCJleHAiOjE3MzM4NjMzOTYsImlhdCI6MTczMzgzNDU5Nn0._cUZQZAwwPAllhWW565UbothJLbQpLkaFKAp8b3Xe6U",
  };

  //   fetch("https://api.fitbit.com/oauth2/token", {
  //   method: "POST",
  //   body:
  //     "response_type=code&client_id=" +
  //     key +
  //     "&scope=activity&code_challenge=" +
  //     codeChallenge +
  //     "&code_challenge_method=S256&state=" +
  //     state,
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  // });

  const fetchPromise = new Promise(function (resolve) {
    fetch(
      "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
      {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        resolve(json);
      });
  });

  let runs = [];
   fetchPromise.then(function (result) {
    runs = result.activities.filter(
      (activity) => activity.activityName === "Run"
    );
    console.log(runs)
  });
}

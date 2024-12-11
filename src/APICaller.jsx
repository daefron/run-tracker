export function apiCall() {
  const data = {
    key: "23PZCT",
    secret: "395d7ddec6dd2384c79bda6d6a1cce29",
    codeVerifier:
      "3w4k4y3d1j455k6y3g5c0o4w5z465r5d0k203d3k5o271u0p6i673j1p3d3924124u195962142h695p3x06513q4p531a0l6v1w472l07024w3c6t6x4p5j0z4p2z37",
    codeChallenge: "9F9SqGpatE3pLH3sO8jaSMI4AeSDtc3ZTCTonQzBJ2k",
    state: "1c6m4b0f4303372a400f0f6b6b0m0g3i",
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByaXJuIHJveHkgcm51dCBycHJvIHJzbGUgcmNmIHJhY3QgcmxvYyBycmVzIHJ3ZWkgcmhyIHJ0ZW0iLCJleHAiOjE3MzM5MTQzMDcsImlhdCI6MTczMzg4NTUwN30.REqjjemB3gS7gTmJU4r1FTGnN0nhF8hlkB2L8BMFdys",
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
    console.log(runs);
  });
}

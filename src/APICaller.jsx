export function apiCall() {
  const data = {
    key: "23PZCT",
    secret: "395d7ddec6dd2384c79bda6d6a1cce29",
    codeVerifier:
      "3w4k4y3d1j455k6y3g5c0o4w5z465r5d0k203d3k5o271u0p6i673j1p3d3924124u195962142h695p3x06513q4p531a0l6v1w472l07024w3c6t6x4p5j0z4p2z37",
    codeChallenge: "9F9SqGpatE3pLH3sO8jaSMI4AeSDtc3ZTCTonQzBJ2k",
    state: "3z6q3256370f38710c5055401v2a0s4n",
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IiwiZXhwIjoxNzMzOTkwNDAzLCJpYXQiOjE3MzM5NjE2MDN9.AawGR9BqhFx51mCFu1qjLrteLDwqC1zs4SRH3iUN82Q",
  };

  const fetchPromise = fetch(
    "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
    {
      headers: {
        Authorization: "Bearer " + data.accessToken,
      },
    }
  ).then(function (response) {
    return response.json();
  });

  let runs = [];
  fetchPromise.then((result) => {
    runs = result.activities.filter(
      (activity) => activity.activityName === "Run"
    );
    console.log(runs);
  });
}

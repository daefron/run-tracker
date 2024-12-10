const data = {
  key: "23PZCT",
  secret: "395d7ddec6dd2384c79bda6d6a1cce29",
  codeVerifier:
    "093336315j232169220r3s5h304c5j3r0v5t573f416c5b591l0k0u0j194d2b3y5e0z0o4p6u1s1q5h0331041r1f3r6m275n6v3d0v4z6v244g4t284l3x5v4j4d23",
  codeChallenge: "s4bF1PwJJ4FdPlESZ-JpRgnPpEkMjgNxML6DAP-0was",
  state: "3d6g0f581g0p3l2j661n5l1z112w1w31",
  accessToken:
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJwcm8iLCJleHAiOjE3MzMxMzA5NTgsImlhdCI6MTczMzEwMjE1OH0.4NacUATSdHqwZ1H85uL0915k9VcGbTKVgHNJ88DVx1g",
};

const fetchProfile = fetch("https://api.fitbit.com/1/user/-/profile.json", {
  headers: {
    Authorization: "Bearer " + data.accessToken,
  },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    return json;
  });

export function profile() {
  return fetchProfile();
  async function fetchProfile() {
    let ppp;
    let profilePromise = new Promise(function (resolve) {
      ppp = fetch("https://api.fitbit.com/1/user/-/profile.json", {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          resolve(json);
        });
    });
    await profilePromise;
    return ppp;
  }
}

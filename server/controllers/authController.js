const db = require("../db/pool");
const auth = require("../tools/auth");
const authData = require("../hidden/authData");
const base64UrlEncode = require("../tools/base64UrlEncode");

async function refreshAuth(req, res) {
  console.log("Refreshing authentication");
  const lastAuth = await auth.getLastAuth();
  const refreshToken = lastAuth.refresh;
  fetch("https://api.fitbit.com/oauth2/token", {
    body:
      "client_id=" +
      authData().client +
      "&grant_type=refresh_token&refresh_token=" +
      refreshToken,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        base64UrlEncode.encode(authData().client + ":" + authData().secret),
    },
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          response.status + " " + response.statusText + " at INTRADAYSTEPS"
        );
      } else {
        return response.json();
      }
    })
    .catch((error) => {
      return error;
    })
    .then(async (data) => {
      if (data instanceof Error) {
        console.log(data);
        return;
      }
      await db.query('INSERT INTO "auth" (access, refresh) VALUES ($1, $2)', [
        data.access_token,
        data.refresh_token,
      ]);
      console.log("Authentication refreshed");
      return;
    });
}

module.exports = {
  refreshAuth,
};

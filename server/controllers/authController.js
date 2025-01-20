const db = require("../db/pool");
const auth = require("../tools/auth");
const base64UrlEncode = require("../tools/base64UrlEncode");

async function refreshAuth(req, res) {
  console.log("Refreshing authentication");
  const lastAuth = await auth.getLastAuth();
  const refreshToken = lastAuth.refresh_token;
  fetch("https://api.fitbit.com/oauth2/token", {
    body:
      "client_id=" +
      process.env.client +
      "&grant_type=refresh_token&refresh_token=" +
      refreshToken,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        base64UrlEncode.encode(process.env.client + ":" + process.env.secret),
    },
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
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
      await db.query(
        "UPDATE auth SET access_token = $1, refresh_token = $2, last_refreshed = $3, refresh_cutoff = $4",
        [data.access_token, data.refresh_token, Date.now(), data.expires_in]
      );
      console.log("Authentication refreshed");
      return;
    });
}

module.exports = {
  refreshAuth,
};

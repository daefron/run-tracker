import { useState, useEffect } from "react";
import { testData } from "./TestData";
import { Loaded } from "./Loaded";
import { Loading } from "./Components/Loading";
import "./App.css";
export default function Main() {
  async function getRuns() {
    function dec2hex(dec) {
      return ("0" + dec.toString(16)).substr(-2);
    }
    function generateRandomString() {
      var array = new Uint32Array(56 / 2);
      window.crypto.getRandomValues(array);
      return Array.from(array, dec2hex).join("");
    }
    function sha256(plain) {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest("SHA-256", data);
    }
    function base64urlencode(a) {
      let str = "";
      const bytes = new Uint8Array(a);
      const len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
      }
      return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
    async function challenge_from_verifier(v) {
      let hashed = await sha256(v);
      return base64urlencode(hashed);
    }
    if (!window.location.search) {
      const verifier = generateRandomString();
      document.cookie = "verifier=" + verifier;
      const challenge = await challenge_from_verifier(verifier);
      const authUrl = new URL(
        "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23PZCT&scope=activity+heartrate&code_challenge=" +
          challenge +
          "&code_challenge_method=S256&state=asdjkfhesfjbdsfkjhwefiuw4eriu4wehf4i3f"
      );
      window.location = authUrl;
    }

    const authCode = window.location.search.split("=")[1].split("&")[0];
    history.pushState(null, "", location.href.split("?")[0]);
    const verifierCookie = document.cookie.split("verifier=")[1];
    fetch("https://api.fitbit.com/oauth2/token", {
      body:
        "client_id=23PZCT" +
        "&grant_type=authorization_code&code=" +
        authCode +
        "&code_verifier=" +
        verifierCookie,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        const accessToken = data.access_token;
        fetch(
          "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            let runs = data.activities.filter(
              (activity) =>
                activity.activityName === "Run" && activity.logType !== "manual"
            );
            let promiseArray = [];
            runs.forEach((run) => {
              let promise = new Promise(function (resolve) {
                fetch(run.heartRateLink, {
                  headers: {
                    Authorization: "Bearer " + accessToken,
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    resolve(data);
                  });
              });
              promiseArray.push(promise);
            });
            let allHeartRateData = [];
            Promise.all(promiseArray).then((run) => {
              allHeartRateData.push(run);
              for (let i = 0; i < runs.length; i++) {
                if (promiseArray[i]) {
                  runs[i].heartRateArray =
                    allHeartRateData[0][i]["activities-heart-intraday"].dataset;
                }
              }
              setLoading(false);
              setRuns(runs);
            });
          });
      });
  }
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getRuns();
      // setTimeout(() => {
      //   console.log("Using test data");
      //   setRuns(testData());
      //   setLoading(false);
      // }, 50);
  }, []);

  if (!loading) {
    return <Loaded runs={runs} />;
  } else {
    return <Loading />;
  }
}

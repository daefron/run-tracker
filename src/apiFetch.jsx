import { testData } from "./TestData";
export function testFetch(setRuns, setLoading) {
  setRuns(testData());
  setLoading(false);
}
export async function apiFetch(setRuns, setLoading, setError) {
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
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
  async function errorCheck(response) {
    if (!response.ok) {
      const text = await response.text();
      console.log(text);
      const code = text.toString().split('code": ')[1].split(',')[0];
      const errorMessage = text
        .toString()
        .split('message": "')[1]
        .split('"')[0];
      setError(code + " " + errorMessage);
      throw new Error(text);
    } else {
      return response.json();
    }
  }
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
    .then((response) => {
      return errorCheck(response);
    })
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
        .then((response) => {
          return errorCheck(response);
        })
        .then((data) => {
          let runs = data.activities.filter(
            (activity) =>
              activity.activityName === "Run" && activity.logType !== "manual"
          );
          let heartRatePromises = [];
          let stepsPromises = [];
          runs.forEach((run) => {
            heartRatePromises.push(intradayPromise("heartRate"));
            stepsPromises.push(intradayPromise("steps"));
            function intradayPromise(type) {
              let link;
              if (type == "heartRate") {
                link = run[type + "Link"];
              } else link = linkMaker(type);
              return new Promise(function (resolve) {
                fetch(link, {
                  headers: {
                    Authorization: "Bearer " + accessToken,
                  },
                }).then((response) => {
                  return errorCheck(response);
                });
              });
              function linkMaker(type) {
                const baselineLink = run["heartRateLink"];
                const dateRange =
                  baselineLink.split("date/")[1].split("/")[0] +
                  "/" +
                  baselineLink.split("date/")[1].split("/")[1];
                let time1 = baselineLink.split("time/")[1].split("/")[0];
                let time2 = baselineLink.split(time1 + "/")[1].split(".")[0];
                if (time1[1] === ":") {
                  time1 = "0" + time1;
                }
                if (time2[1] === ":") {
                  time2 = "0" + time2;
                }
                return (
                  "https://api.fitbit.com/1/user/-/activities/" +
                  type +
                  "/date/" +
                  dateRange +
                  "/1min/time/" +
                  time1 +
                  "/" +
                  time2 +
                  ".json"
                );
              }
            }
          });
          let allHeartRateData = [];
          let allStepsData = [];
          function unpackPromises(type, promises, array, run, arrayName) {
            array.push(run);
            for (let i = 0; i < runs.length; i++) {
              if (promises[i]) {
                runs[i][arrayName] =
                  array[0][i]["activities-" + type + "-intraday"].dataset;
              }
            }
          }
          Promise.all(heartRatePromises).then((run) => {
            unpackPromises(
              "heart",
              heartRatePromises,
              allHeartRateData,
              run,
              "heartRateArray"
            );
            Promise.all(stepsPromises).then((run) => {
              unpackPromises(
                "steps",
                stepsPromises,
                allStepsData,
                run,
                "stepsArray"
              );
            });
            setLoading(false);
            setRuns(runs);
          });
        });
    });
}

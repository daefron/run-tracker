import { Page } from "./Page";
import { useState, useEffect } from "react";
export default function Main() {
  //data currently being manually input
  const authData = {
    key: "23PZCT",
    secret: "395d7ddec6dd2384c79bda6d6a1cce29",
    codeVerifier:
      "3w4k4y3d1j455k6y3g5c0o4w5z465r5d0k203d3k5o271u0p6i673j1p3d3924124u195962142h695p3x06513q4p531a0l6v1w472l07024w3c6t6x4p5j0z4p2z37",
    codeChallenge: "9F9SqGpatE3pLH3sO8jaSMI4AeSDtc3ZTCTonQzBJ2k",
    state: "6z3k31384f1c5133630o5c6f5669532u",
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJociIsImV4cCI6MTczNDAwNDM0MywiaWF0IjoxNzMzOTc1NTQzfQ.JAwlnAfbp6nG-1mFf2gmGqvxf5GDjII-KvOAhwvqZW0",
  };
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const getRuns = async () => {
    setLoading(true);
    fetch(
      "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
      {
        headers: {
          Authorization: "Bearer " + authData.accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let runs = data.activities.filter(
          (activity) => activity.activityName === "Run"
        );
        let promiseArray = [];
        runs.forEach((run) => {
          let promise = new Promise(function (resolve) {
            fetch(run.heartRateLink, {
              headers: {
                Authorization: "Bearer " + authData.accessToken,
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
            runs[i].heartRateArray =
              allHeartRateData[0][i]["activities-heart-intraday"].dataset;
          }
          setRuns(runs);
          setLoading(false);
        });
      });
  };
  useEffect(() => {
    getRuns();
  }, []);

  return <Page runs={runs} loading={loading}></Page>;
}

import { Page } from "./Page";
import { useState, useEffect } from "react";
import { testData } from "./TestData";
export default function Main() {
  //data currently being manually input
  const authData = {
    key: "23PZCT",
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByaXJuIHJveHkgcm51dCBycHJvIHJzbGUgcmNmIHJhY3QgcnJlcyBybG9jIHJ3ZWkgcmhyIHJ0ZW0iLCJleHAiOjE3MzQzNTM4OTcsImlhdCI6MTczNDMyNTA5N30.oJG1wIN04ZsUNs-_5wTLYCVaW1MX_snbg7H-m7NJO-4",
  };
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  // const getRuns = async () => {
  //   setLoading(true);
  //   fetch(
  //     "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
  //     {
  //       headers: {
  //         Authorization: "Bearer " + authData.accessToken,
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       let runs = data.activities.filter(
  //         (activity) => activity.activityName === "Run"
  //       );
  //       let promiseArray = [];
  //       runs.forEach((run) => {
  //         let promise = new Promise(function (resolve) {
  //           fetch(run.heartRateLink, {
  //             headers: {
  //               Authorization: "Bearer " + authData.accessToken,
  //             },
  //           })
  //             .then((response) => response.json())
  //             .then((data) => {
  //               resolve(data);
  //             });
  //         });
  //         promiseArray.push(promise);
  //       });
  //       let allHeartRateData = [];
  //       Promise.all(promiseArray).then((run) => {
  //         allHeartRateData.push(run);
  //         for (let i = 0; i < runs.length; i++) {
  //           runs[i].heartRateArray =
  //             allHeartRateData[0][i]["activities-heart-intraday"].dataset;
  //         }
  //         setRuns(runs);
  //         setLoading(false);
  //       });
  //     });
  // };
  // useEffect(() => {
  //   getRuns();
  // }, []);

  // return <Page runs={runs} loading={loading}></Page>;
  return <Page runs={testData()} ></Page>;
}

import { Page } from "./Page";
import { useState, useEffect } from "react";
import { testData } from "./TestData";
export default function Main() {
  //data currently being manually input
  const authData = {
    key: "23PZCT",
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByaXJuIHJveHkgcnBybyBybnV0IHJzbGUgcmNmIHJhY3QgcnJlcyBybG9jIHJ3ZWkgcmhyIHJ0ZW0iLCJleHAiOjE3MzQzNzAwNDEsImlhdCI6MTczNDM0MTI0MX0.wtes5OoLC7nUhk0TQq2EfWT1Nj1QpSk7bMtrlw-DXTc",
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
  //         if (run.logType === "manual") {
  //           promiseArray.push(null);
  //           return;
  //         }
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
  //           if (promiseArray[i]) {
  //             runs[i].heartRateArray =
  //               allHeartRateData[0][i]["activities-heart-intraday"].dataset;
  //           }
  //         }
  //         console.log(runs);
  //         setLoading(false);
  //         setRuns(runs);
  //       });
  //     });
  // };
  // useEffect(() => {
  //   getRuns();
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setRuns(testData());
      setLoading(false);
    }, 50);
  }, []);
  return <Page runs={runs} loading={loading} />;
}

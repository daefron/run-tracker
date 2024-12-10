import { useState, useRef } from "react";
import { ChartLine } from "./Components/ChartLine.jsx";
import { runsParser } from "./RunsParser.jsx";
import { msToChart } from "./Tools.jsx";
import { RunListTitle } from "./Components/RunListTitle.jsx";
import { RunList } from "./Components/RunList.jsx";
import { AllRuns } from "./Components/AllRuns.jsx";
import "./App.css";
export default function Page() {
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
  // }));

  // const data = {
  //   key: "23PZCT",
  //   secret: "395d7ddec6dd2384c79bda6d6a1cce29",
  //   codeVerifier:
  //     "093336315j232169220r3s5h304c5j3r0v5t573f416c5b591l0k0u0j194d2b3y5e0z0o4p6u1s1q5h0331041r1f3r6m275n6v3d0v4z6v244g4t284l3x5v4j4d23",
  //   codeChallenge: "s4bF1PwJJ4FdPlESZ-JpRgnPpEkMjgNxML6DAP-0was",
  //   state: "3d6g0f581g0p3l2j661n5l1z112w1w31",
  //   accessToken:
  //     "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BaQ1QiLCJzdWIiOiJDQzgzR0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJwcm8iLCJleHAiOjE3MzMxMzA5NTgsImlhdCI6MTczMzEwMjE1OH0.4NacUATSdHqwZ1H85uL0915k9VcGbTKVgHNJ88DVx1g",
  // };

  // const fetchPromise = new Promise(function (resolve) {
  //   fetch(
  //     "https://api.fitbit.com/1/user/-/activities/list.json?afterDate=2000-01-01&sort=desc&offset=0&limit=100",
  //     {
  //       headers: {
  //         Authorization: "Bearer " + data.accessToken,
  //       },
  //     }
  //   )
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (json) {
  //       resolve(json);
  //     });
  // });

  // let runs,
  //   parsedRuns = [];
  // fetchPromise.then(function (result) {
  //   runs = result.activities.filter(
  //     (activity) => activity.activityName === "Run"
  //   );
  //   console.log(runs);
  //   for (const run of runs) {
  //     let parsedRun = new Run(run);
  //     parsedRuns.push(parsedRun);
  //   }
  //   console.log(parsedRuns);
  // });

  const runsRef = useRef(runsParser());
  const [activeItem, setActiveItem] = useState(0);

  return (
    <>
      <div id="body">
        <div id="left">
          <RunListTitle></RunListTitle>
          <RunList
            runs={runsRef.current}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          ></RunList>
          <AllRuns
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          ></AllRuns>
        </div>
        <div id="right">
          <ChartLine
            xAxis="date"
            yAxis="duration"
            yAxisFormatter={msToChart}
            runs={runsRef.current}
          ></ChartLine>
          <ChartLine
            xAxis="date"
            yAxis="distance"
            yAxisUnit=" km"
            runs={runsRef.current}
          ></ChartLine>
        </div>
      </div>
    </>
  );
}

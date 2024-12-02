import { useState, useEffect } from "react";
import { profile } from "./API.jsx";
import "./App.css";
// console.log(fetch("https://api.fitbit.com/oauth2/token", {
export default function Ping() {
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

  const testingData = {
    activeDuration: 918000,
    activeZoneMinutes: {
      totalMinutes: 15,
      minutesInHeartRateZones: "Array(4)",
    },
    activityLevel: ["{…}", "{…}", "{…}", "{…}"],
    activityName: "Run",
    activityTypeId: 90009,
    calories: 265,
    caloriesLink:
      "https://api.fitbit.com/1/user/-/activities/calories/date/2024-12-01/2024-12-01/1min/time/12:30/12:45.json",
    distance: 2.54427,
    distanceUnit: "Kilometer",
    duration: 920000,
    elevationGain: 0,
    hasActiveZoneMinutes: true,
    heartRateZones: [],
    inProgress: false,
    intervalWorkoutData: { intervalSummaries: "Array(0)", numRepeats: 0 },
    lastModified: "2024-12-01T01:47:59.428Z",
    logId: 2474517443734024000,
    logType: "tracker",
    manualValuesSpecified: { calories: false, distance: false, steps: false },
    originalDuration: 920000,
    originalStartTime: "2024-12-01T12:30:28.000+11:00",
    pace: 360.81076300864294,
    source: {
      type: "tracker",
      name: "Inspire 3",
      id: "E1D82A22963F",
      url: "https://www.fitbit.com/",
      trackerFeatures: "Array(7)",
    },
    speed: 9.977529411764706,
    startTime: "2024-12-01T12:30:28.000+11:00",
    steps: 2276,
    tcxLink:
      "https://api.fitbit.com/1/user/-/activities/2474517443734024400.tcx",
  };
  class Run {
    constructor(run) {
      this.date = run.originalStartTime.split("T")[0];
      this.initialTime = dateTimeParser(run.originalStartTime);
      this.duration = timeParser(run.duration);
      this.endTime = endTimeCalc(this.initialTime, this.duration);
      this.distance = run.distance;
      this.speed = run.speed;
      this.steps = run.steps;
      function dateTimeParser(dateString) {
        let parsed = dateString.split("T")[1];
        parsed = parsed.split("+")[0];
        let hour = Number(parsed.split(":")[0]);
        let mins = Number(parsed.split(":")[1]);
        let secs = Number(parsed.split(":")[2]);
        return [hour, mins, secs];
      }
      function timeParser(duration) {
        let seconds = duration / 1000;
        let mins = seconds / 60;
        let hours = mins / 60;
        if (hours < 1) {
          hours = 0;
        }
        if (mins < 1) {
          mins = 0;
        }
        if (mins % 1) {
          let remainder = mins % 1;
          mins -= remainder;
          seconds = parseInt(remainder * 60);
        }
        return [hours, mins, seconds];
      }
      function endTimeCalc(initialTime, duration) {
        let hours = initialTime[0];
        let mins = initialTime[1];
        let secs = initialTime[2];
        if (secs + duration[2] >= 60) {
          mins++;
          secs += duration[2] - 60;
        } else secs += duration[2];
        if (mins + duration[1] >= 60) {
          hours++;
          mins += duration[1] - 60;
        } else mins += duration[1];
        return [hours, mins, secs];
      }
    }
  }
  let newRun = new Run(testingData);
  const [runs, setRuns] = useState(["hi", "hello"]);
  for (let i = 0; i !== 13; i++) {
    runs.push([newRun, i]);
  }

  function RunList() {
    return (
      <div>
        {runs.map((run) => {
          return <RunItem key={run[0] + run[1]} data={run[0]}></RunItem>;
        })}
      </div>
    );
  }

  function RunItem(props) {
    return (
      <div style={{ display: "flex" }}>
        <p>{props.data.date}</p>
        <p>{props.data.initialTime}</p>
        <p>{props.data.duration}</p>
        <p>{props.data.disatnce}</p>
      </div>
    );
  }

  return (
    <div>
      <RunList></RunList>
    </div>
  );
}

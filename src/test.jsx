import { useState, useRef } from "react";
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

  const testingData = [
    {
      activityName: "Run",
      calories: 265,
      distance: 2.24427,
      distanceUnit: "Kilometer",
      duration: 830000,
      elevationGain: 0,
      originalStartTime: "2024-11-22T11:20:24.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 1.54427,
      distanceUnit: "Kilometer",
      duration: 650000,
      elevationGain: 0,
      originalStartTime: "2024-11-24T09:10:22.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 2.94427,
      distanceUnit: "Kilometer",
      duration: 910000,
      elevationGain: 0,
      originalStartTime: "2024-11-27T15:50:58.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 2.45427,
      distanceUnit: "Kilometer",
      duration: 1020000,
      elevationGain: 0,
      originalDuration: 1020000,
      originalStartTime: "2024-11-29T07:30:02.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
    },
    {
      activityName: "Run",
      calories: 265,
      distance: 2.54427,
      distanceUnit: "Kilometer",
      duration: 920000,
      elevationGain: 0,
      originalDuration: 920000,
      originalStartTime: "2024-12-01T12:30:28.000+11:00",
      pace: 360.81076300864294,
      speed: 9.977529411764706,
      steps: 2276,
    },
  ];
  class Run {
    constructor(run) {
      this.date = run.originalStartTime.split("T")[0];
      this.initialTime = dateTimeParser(run.originalStartTime);
      this.duration = timeParser(run.duration);
      this.endTime = endTimeCalc(this.initialTime, this.duration);
      this.distance = run.distance.toFixed(2);
      this.speed = run.speed;
      this.steps = run.steps;
      this.render = {
        date: toAusDate(this.date),
        startTime: timeJoiner(renderTime(this.initialTime)),
        duration: timeJoiner(renderTime(this.duration)),
        distance: this.distance + "km",
      };
      function toAusDate(date) {
        let splitDate = date.split("-");
        return splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      }
      function renderTime(time) {
        let newTime = [];
        time.forEach((number) => {
          if (number.toString().length < 2) {
            newTime.push("0" + number);
          } else newTime.push(number);
        });
        return newTime;
      }
      function dateTimeParser(dateString) {
        let parsed = dateString.split("T")[1];
        parsed = parsed.split("+")[0].split(":");
        let hour = Number(parsed[0]);
        let mins = Number(parsed[1]);
        let secs = Number(parsed[2]);
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
        } else seconds = 0;
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
      function timeJoiner(time) {
        return time[0] + ":" + time[1] + ":" + time[2];
      }
    }
  }

  function runStatePacker() {
    let holder = [];
    for (let i = 0; i !== testingData.length; i++) {
      let newRun = new Run(testingData[i]);
      newRun.index = i;
      if (i > 0) {
        let competingDistance = holder[i - 1].distance;
        newRun.distanceDiff = newRun.distance - competingDistance;
        let competingTime = holder[i - 1].duration;
        newRun.durationDiff = durationDiffCalc(newRun.duration, competingTime);
        function durationDiffCalc(duration, competingTime) {
          let hours = (duration[0] - competingTime[0]) * 3600;
          let mins = (duration[1] - competingTime[1]) * 60;
          let secs = duration[2] - competingTime[2];
          let totalDiff = hours + mins + secs;
          let minsDiff = totalDiff / 60;
          let secsDiff = parseInt((minsDiff % 1) * 60);
          minsDiff = parseInt(minsDiff - secsDiff / 60);
          let renderDiff = [0, minsDiff, secsDiff];
          return renderDiff;
        }
      }
      holder.push(newRun);
    }
    console.log(holder);
    return holder;
  }
  const runsRef = useRef(runStatePacker());

  function RunListTitle() {
    return (
      <div id="leftTitle">
        <p>Date</p>
        <p>Duration</p>
        <p>Length</p>
      </div>
    );
  }

  function RunList() {
    return (
      <div id="runList">
        {runsRef.current.map((run) => {
          return <RunItem key={run.date + run.index} data={run}></RunItem>;
        })}
      </div>
    );
  }

  const [activeItem, setActiveItem] = useState("runItem0");
  function RunItem(props) {
    return (
      <div
        className="runItem"
        style={
          activeItem === props.data.index
            ? {
                backgroundColor: "#cacaca",
              }
            : {
                backgroundColor: "white",
              }
        }
        onClick={function () {
          runItemSelect(props.data.index);
        }}
      >
        <RunItemStat type="date" data={props.data}></RunItemStat>
        <RunItemStat type="startTime" data={props.data}></RunItemStat>
        <RunItemStat type="duration" data={props.data}></RunItemStat>
        <RunItemStat type="distance" data={props.data}></RunItemStat>
      </div>
    );
  }

  function RunItemStat(props) {
    let content = props.data.render[props.type];
    return (
      <>
        <p
          onClick={function () {
            runItemSelect(props.data.index);
          }}
        >
          {content}
        </p>
      </>
    );
  }

  function runItemSelect(index) {
    setActiveItem(index);
  }

  function AllRuns() {
    return (
      <>
        <p
          id="allRuns"
          style={
            activeItem === "allRuns"
              ? {
                  backgroundColor: "#cacaca",
                }
              : {
                  backgroundColor: "white",
                }
          }
          onClick={function () {
            runItemSelect("allRuns");
          }}
        >
          All runs
        </p>
      </>
    );
  }

  return (
    <>
      <div id="body">
        <div id="left">
          <RunListTitle></RunListTitle>
          <RunList></RunList>
          <AllRuns></AllRuns>
        </div>
        <div id="right"></div>
      </div>
    </>
  );
}

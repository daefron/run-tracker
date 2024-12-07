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
  function Time(hours, mins, secs) {
    this.hours = hours;
    this.mins = mins;
    this.secs = secs;
  }
  class Run {
    constructor(run) {
      this.date = run.originalStartTime.split("T")[0];
      this.initialTime = dateTimeParser(run.originalStartTime);
      this.duration = msToObject(run.duration);
      this.endTime = endTimeCalc(this.initialTime, this.duration);
      this.distance = Number(run.distance.toFixed(2));
      this.speed = run.speed;
      this.steps = run.steps;
      this.render = {
        date: toAusDate(this.date),
        startTime: renderTime(this.initialTime),
        duration: renderDuration(this.duration, this),
        distance: this.distance + " km",
      };
      function toAusDate(date) {
        let splitDate = date.split("-");
        return splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      }
      function dateTimeParser(dateString) {
        let parsed = dateString.split("T")[1];
        parsed = parsed.split("+")[0].split(":");
        let hour = Number(parsed[0]);
        let mins = Number(parsed[1]);
        let secs = Number(parsed[2]);
        return new Time(hour, mins, secs);
      }
      function endTimeCalc(initialTime, duration) {
        let initialTimeMs = objectToMs(initialTime);
        let durationMs = objectToMs(duration);
        let endTime = msToObject(initialTimeMs + durationMs);
        return endTime;
      }
    }
  }

  function runStatePacker() {
    let holder = [];
    for (let i = 0; i !== testingData.length; i++) {
      let newRun = new Run(testingData[i]);
      newRun.index = i;
      holder.push(newRun);
    }
    holder.forEach((run) => {
      run.lastRun = holder[run.index - 1];
      if (run.lastRun) {
        let competingDistance = run.lastRun.distance;
        let distance = run.distance;
        run.distanceDiff = distance - competingDistance;
        if (run.distanceDiff < 0) {
          run.distanceNegative = true;
        }
        run.render.distanceDiff = Number(run.distanceDiff.toFixed(2)) + " km";
        let competingTime = objectToMs(run.lastRun.duration);
        let time = objectToMs(run.duration);
        run.durationDiff = msToObject(time - competingTime);
        run.render.durationDiff = renderDuration(run.durationDiff, run);
      }
      run.nextRun = holder[run.index + 1];
    });
    console.log(holder);
    return holder;
  }
  function renderTime(time) {
    let newTime = [];
    for (const number in time) {
      if (time[number].toString().length < 2) {
        newTime.push("0" + time[number]);
      } else newTime.push(time[number]);
    }
    newTime = new Time(newTime[0], newTime[1], newTime[2]);
    return newTime.hours + ":" + newTime.mins + ":" + newTime.secs;
  }
  function renderDuration(time, run) {
    let newTime = new Time(time.hours, time.mins, time.secs);
    let negative;
    for (const type in newTime) {
      if (newTime[type] < 0) {
        newTime[type] *= -1;
        negative = true;
        run.durationNegative = true;
      }
    }
    if (newTime.secs.toString().length < 2) {
      newTime.secs = "0" + newTime.secs;
    }
    let renderString;
    if (newTime.hours === 0 && newTime.mins === 0) {
      renderString = newTime.secs;
    } else if (newTime.hours === 0) {
      renderString = newTime.mins + ":" + newTime.secs;
    } else
      renderString = newTime.hours + ":" + newTime.mins + ":" + newTime.secs;
    if (negative) {
      renderString = "-" + renderString;
    }
    return renderString;
  }

  function msToObject(time) {
    let hourIn = 3600000;
    let minIn = 60000;
    let secsIn = 1000;
    if (time < 0) {
      hourIn = -3600000;
      minIn = -60000;
      secsIn = -1000;
    }
    let hours = 0;
    let mins = 0;
    let secs = 0;
    if (time / hourIn >= 1) {
      hours = time / hourIn;
      let hourRemainder = hours % 1;
      hours -= hourRemainder;
      mins = hourRemainder * 60;
      let minsRemainder = mins % 1;
      mins -= minsRemainder;
      secs = parseInt(minsRemainder * 60);
      if (time > 0) {
        return new Time(hours, mins, secs);
      }
      return new Time(-hours, -mins, -secs);
    }
    if (time / minIn >= 1) {
      mins = time / minIn;
      let minsRemainder = mins % 1;
      mins -= minsRemainder;
      secs = parseInt(minsRemainder * 60);
      if (time > 0) {
        return new Time(hours, mins, secs);
      }
      return new Time(-hours, -mins, -secs);
    }
    secs = parseInt(time / secsIn);
    if (time > 0) {
      return new Time(hours, mins, secs);
    }
    return new Time(-hours, -mins, -secs);
  }

  function objectToMs(time) {
    let total = 0;
    let hourIn = 3600000;
    let minIn = 60000;
    let secIn = 1000;
    total += time.hours * hourIn;
    total += time.mins * minIn;
    total += time.secs * secIn;
    return total;
  }

  const runsRef = useRef(runStatePacker());
  const [activeItem, setActiveItem] = useState(0);

  function RunListTitle() {
    return (
      <div id="leftTitle">
        <p>Date</p>
        <p>Start Time</p>
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
        onClick={() => {
          setActiveItem(props.data.index);
        }}
      >
        <RunItemStat type="date" data={props.data}></RunItemStat>
        <RunItemStat type="startTime" data={props.data}></RunItemStat>
        <RunItemStat type="duration" data={props.data}></RunItemStat>
        <RunItemStat
          type="duration"
          diff={true}
          data={props.data}
        ></RunItemStat>
        <RunItemStat type="distance" data={props.data}></RunItemStat>
        <RunItemStat
          type="distance"
          diff={true}
          data={props.data}
        ></RunItemStat>
      </div>
    );
  }

  function RunItemStat(props) {
    let content = props.data.render[props.type];
    let statStyle = {};
    if (props.diff) {
      content = props.data.render[props.type + "Diff"];
      if (props.data[props.type + "Negative"]) {
        statStyle.color = "Red";
      } else statStyle.color = "Green";
    }
    return (
      <>
        <p
          style={statStyle}
          onClick={() => {
            setActiveItem(props.data.index);
          }}
        >
          {content}
        </p>
      </>
    );
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
          onClick={() => {
            setActiveItem("allRuns");
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

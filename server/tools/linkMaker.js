function linkMaker(type, run) {
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
module.exports = { linkMaker };

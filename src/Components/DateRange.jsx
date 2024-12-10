import { useState } from "react";
export function DateRange(props) {
  const currentDate = new Date();
  function dayArray(length) {
    let days = [];
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const maxDays = daysInMonth(currentMonth, currentYear);
    for (let i = length; i >= 0; i--) {
      let newDay = new Date(currentYear, currentMonth, currentDay - i);
      days.push(newDay);
    }
    return days;
  }
  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  const [dateRange, setDateRange] = useState(dayArray(6));
  
  function dateParser(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return [day, month, year];
  }
  

  return <div></div>;
}

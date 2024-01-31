const events = [
    { title: "Busy", start: getDate("YEAR-MONTH-05T12:00:00+00:00") },
    { title: "Available", start: getDate("YEAR-MONTH-05T03:00:00+00:00") },
    { title: "Busy", start: getDate("YEAR-MONTH-07T14:30:00+00:00") },
    { title: "Busy", start: getDate("YEAR-MONTH-07T12:30:00+00:00") },
    { title: "Busy", start: getDate("YEAR-MONTH-10T17:30:00+00:00") },
    { title: "Available", start: getDate("YEAR-MONTH-11T20:00:00+00:00") }
  ];
  
  function getDate(dayString) {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();
  
    if (month.length === 1) {
      month = "0" + month;
    }
  
    return dayString.replace("YEAR", year).replace("MONTH", month);
  }
  
  export default events;
  
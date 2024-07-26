export const getCurrentMonthInfo = () => {
  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  //Get the current month index (0-11)
  const currentMonthIndex = currentDate.getMonth();
  //get the current month name from the monthNamesShort array
  const currentMonthName = monthNamesShort[currentMonthIndex];
  const currentMonthNameFull = monthNamesFull[currentMonthIndex];
  //Get the current month(0-11), so we add 1 to get the human-readable month (1-12)
  const currentMonth = currentDate.getMonth() + 1;
  //get the current year (e.g., 2024)
  const currentYear = currentDate.getFullYear();
  //Create a new date object for the first day of the month
  //Setting the day to 0 of the next month will return the last day of the current month
  const nextMonth = new Date(currentYear, currentMonth, 0);
  //Get the day of the 'nextMonth' date object, which is the last day of the current month
  const daysInCurrentMonth = nextMonth.getDate();
  //month number example if April, 04
  const currentMonthNum =
    currentMonthIndex < 10
      ? "0" + (currentMonthIndex + 1)
      : currentMonthIndex + 1;
  //month number example if April, 4
  const currentMonthNumNoZero = currentMonthNum + 1;
  return {
    currentMonthName,
    currentMonthNameFull,
    daysInCurrentMonth,
    currentYear,
    monthNamesShort,
    currentMonthNum,
    currentMonthNumNoZero,
  };
};

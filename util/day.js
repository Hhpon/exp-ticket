function getDateAfter_n(initDate, days) {
  let year = initDate.substring(0, 4);
  let month = initDate.substring(5, 7);
  let day = initDate.substring(8, 10);
  let date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  let yearStr = date.getFullYear();
  let monthStr = ("0" + (date.getMonth() + 1)).slice(-2);
  let dayStr = ("0" + date.getDate()).slice(-2);
  return yearStr + "-" + monthStr + "-" + dayStr + initDate.substring(10);
}

module.exports = getDateAfter_n;

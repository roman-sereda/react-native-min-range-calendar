let getMonthSize = (year, month) => (new Date(year, month + 1, 0).getDate())
let firstDayOfMonth = (year, month) => (new Date(year, month, 1))
let getNewDate = (date, value) => new Date(new Date(date.getTime()).setDate(value + 1)).getDate()

// this method returns arrays of integers with dates for calendat page
// how do we get this?
// TODO: explain this
exports.getMonth = (year, month) => {

  let monthSize = getMonthSize(year, month);
  let firstDay = firstDayOfMonth(year, month);
  let firstDayWeekIndex = firstDay.getDay();
  let weeksCount = Math.ceil((monthSize + firstDayWeekIndex) / 7);

  let data = [];

  for(let week = 0; week < weeksCount; week++){
    data.push([]);

    for(let day = 0; day < 7; day++){

      let index = week * 7 + day;

      if(index < firstDayWeekIndex){
        data[week].push(getNewDate(firstDay, index - firstDayWeekIndex));
      } else if(index >= monthSize + firstDayWeekIndex){
        data[week].push(getNewDate(firstDay, index - firstDayWeekIndex));
      }else{
        data[week].push(index - firstDayWeekIndex + 1)
      }
    }
  }

  return data;
}

exports.subtractMonth = (_date) => {
  let date = _date;

  date.month--;

  if(date.month < 0){
    date.month = 11;
    date.year--;
  }

  return date;
}

exports.addMonth = (_date) => {
  let date = _date;

  date.month++;

  if(date.month > 11){
    date.month = 0;
    date.year++;
  }

  return date;
}

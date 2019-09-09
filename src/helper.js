import styleColors from './colors';

let getMonthSize = (year, month) => (new Date(year, month + 1, 0).getDate())
let firstDayOfMonth = (year, month) => (new Date(year, month, 1))
let getNewDate = (date, value) => new Date(new Date(date.getTime()).setDate(value + 1)).getDate()

// this method returns arrays of integers with dates for calendat page
// how do we get this?
// TODO: explain this
const getMonth = (year, month) => {

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

const subtractMonth = (_date) => {
  let date = _date;

  date.month--;

  if(date.month < 0){
    date.month = 11;
    date.year--;
  }

  return date;
}

addMonth = (_date) => {
  let date = _date;

  date.month++;

  if(date.month > 11){
    date.month = 0;
    date.year++;
  }

  return date;
}

const getDayNames = (locale) => {
  // some random Sunday date
  let date = new Date(1567951846289), days = [];

  for(let i = 0; i < 7; i += 1){
    days.push(date.toLocaleString(locale, { weekday: 'short' }));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

const getMonthNames = (locale) => {
  // some random January date
  let date = new Date(1546874284089), months = [];

  for(let i = 0; i < 12; i++){
    months.push(date.toLocaleString(locale, { month: 'long' }));
    date.setMonth(date.getMonth() + 1);
  }

  return months;
}

const mergeColors = (_newColors) => {

  let colors = styleColors;

  Object.keys(_newColors).forEach(key => {
    if(colors[key]){
      colors[key] = _newColors[key];
    }
  })

  return colors;
}

const mergeStyles = (_styles, _newStyles, colors) => {

    let styles = _styles(colors);

    Object.keys(_newStyles).forEach(key => {
      if(styles[key]){
        styles[key] = _newStyles[key];
      }
    })

    return styles;
  }

  export default {
    mergeStyles,
    mergeColors,
    getMonthNames,
    getDayNames,
    subtractMonth,
    getMonth,
    addMonth
  }

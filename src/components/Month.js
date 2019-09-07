import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CustomDate from '../CustomDate';
import time from '../helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

let styles = {
  wrapper: {
    paddingBottom: 10,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#10245c'
  },
  topBar: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  calendar: {
    height: height
  },
  month: {
    flexDirection: 'column'
  },
  week: {
    flexDirection: 'row',
    height: weekHeight,
    marginBottom: weekPadding,
  },
  day: {
    width: "14.2857142857%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    color: '#53628c'
  },
  selected: {
    width: weekHeight + weekPadding,
    height: weekHeight + weekPadding,
    backgroundColor: '#488eff',
    borderRadius: (weekHeight + weekPadding) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  selectedDay: {
    borderRadius: 25,
    color: 'white',
  },
  weekend: {
    color: '#df6565',
  },
  rangedDay: {
    backgroundColor: '#edf4ff',
  }
}

class Month extends Component{
  constructor(props){
    super(props)

    this.state = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      start: false,
      end: false,
      dayNames: [],
      monthNames: []
    }
  }

  componentDidMount(){
    let currentDate = new Date("05.8.19 00:00:00 GMT+0300");
    let dayNames = this.getDayNames();
    let monthNames = this.getMonthNames();
    this.setState({ month: currentDate.getMonth(), year: currentDate.getFullYear(), dayNames, monthNames });
  }

  renderDayNames(){
    const { dayNames } = this.state;

    return dayNames.map(day => {
      return <View style = {styles.day}><Text style = {{ color: '#b5b7b9' }}>{ day }</Text></View>
    })
  }

  getDayNames(){
    // some random Sunday date
    let date = new Date(1567951846289), days = [];

    for(let i = 0; i < 7; i += 1){
      days.push(date.toLocaleString('en-us', { weekday: 'short' }));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  getMonthNames(){
    // some random January date
    let date = new Date(1546874284089), months = [];

    for(let i = 0; i < 12; i++){
      months.push(date.toLocaleString('en-us', { month: 'long' }));
      date.setMonth(date.getMonth() + 1);
    }

    return months;
  }

  renderDate(date, style){

    const text = <Text onPress = {(e) => this.select(date)} style = {[styles.dayText, date.isMain ? styles.weekend : {}, date.selected ? { color: 'white' } : {}]}>{ date.day }</Text>

    const s = date.selected ?
      <View>
        <View style = {[{ position: 'absolute', top: weekPadding / 2, backgroundColor: '#edf4ff', width: '50%', height: weekHeight }, date.left ? { right: '-25%' } : { left: '-25%' }]} />
        <View style = {styles.selected}>
          { text }
        </View>
      </View>
      : text;


    return <View
      style = {[styles.day, style]}>
      { s }
    </View>
  }

  renderWeeks(weeks){
    const { year, start, end, month } = this.state;

    // we iterate calendar page, this variables shows if iteration has reached
    // start and end of date range
    let startReached = false, endReached = false;
    let weeksCount = weeks.length - 1;
    // this is the first date in our calendar page(calendar page could also show
    // some days from previous or next month because we show every week that has
    // at least one day from choseen month)
    let startDate = { day: weeks[0][0], month, year };
    // this is how we check if day from previous month
    if(weeks[0][0] > 7) startDate = time.subtractMonth(startDate)

    // if start and/or end of the range is before start of calendar page then
    // we have already reached them
    if(start && start.isBefore(startDate)) startReached = true;
    if(end && end.isBefore(startDate)) endReached = true;

    return weeks.map((week, weekIndex) => {
      return(<View style = {styles.week}>{
        week.map((day, dayIndex) => {

          let date = { day, month, year, isMain: dayIndex == 0 };

          // check if day is from previous or next month
          if(weekIndex == 0 && day > 7) date = time.subtractMonth(date);
          if(weekIndex == weeksCount && day < 7) date = time.addMonth(date);

          if(!startReached && start && start.isEqualTo(date)){
            startReached = true;
            date.selected = true;
            date.left = true;
            return this.renderDate(date, {});
          }

          if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            date.selected = true;
            return this.renderDate(date, {});
          }

          // if start reached but end - no, then this day in range
          if(end !== false && startReached && !endReached){
            return this.renderDate(date, styles.rangedDay);
          }

          return this.renderDate(date, {});
        })
      }</View>);})
  }

  select(date){
    const { start, end } = this.state;

    let newDate = new CustomDate(date);

    if(start !== false && end !== false){
      this.setState({ start: newDate, end: false})
    } else if(start === false){
      this.setState({ start: newDate});
    // if second selected date if after start then set this date as end,
    // if not - set selected date as new start
    }else if(start.isBefore(newDate)){
      this.setState({ end: newDate});
    } else {
      this.setState({ start: newDate, end: false})
    }
  }

  nextMonth(){
    const { month, year } = this.state;

    let date = time.addMonth({ month, year });
    this.setState({ month: date.month, year: date.year });
  }

  prevMonth(){
    const { month, year } = this.state;

    let date = time.subtractMonth({ month, year });
    this.setState({ month: date.month, year: date.year });
  }

  render(){
    const { month, year } = this.state;

    let weeks = time.getMonth(year, month);

    let monthName = this.state.monthNames.length > 0 ? this.state.monthNames[month] : "-";

    return(
      <View style = {styles.wrapper}>
        <View style = {styles.topBar}>
          <Text style = {styles.navigation} onPress={() => this.prevMonth()}>{ "<" }</Text>
          <Text style = {styles.title}>{ monthName }</Text>
          <Text style = {styles.navigation} onPress={() => this.nextMonth()}>{ ">" }</Text>
        </View>
        <View style = {styles.calendar}>
          <View style = {styles.week}>
            { this.renderDayNames() }
          </View>
          <View style = {styles.month}>
            { this.renderWeeks(weeks) }
          </View>
        </View>
      </View>
    )
  }
}

export default Month;

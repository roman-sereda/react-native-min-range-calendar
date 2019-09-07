import { compareAsc, format } from 'date-fns';
import React, { Component } from 'react';
import CustomDate from '../CustomDate';
import time from '../helper';

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

    console.log(months)

    return months;
  }

  renderDate(date, color){
    return <span
      onClick = {(e) => this.select(date)}
      style = {{ width: 25, display: "inline-block", backgroundColor: color }}>
      { date.day }
    </span>
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
      return(<div style = {{ height: 25 }}>{
        week.map((day, dayIndex) => {

          let date = { day, month, year };

          // check if day is from previous or next month
          if(weekIndex == 0 && day > 7) date = time.subtractMonth(date);
          if(weekIndex == weeksCount && day < 7) date = time.addMonth(date);

          if(!startReached && start && start.isEqualTo(date)){
            startReached = true;
            return this.renderDate(date, "red");
          }

          if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            return this.renderDate(date, "blue");
          }

          // if start reached but end - no, then this day in range
          if(end !== false && startReached && !endReached){
            return this.renderDate(date, "green");
          }

          return this.renderDate(date, "white");
        })
      }</div>);})
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
      <div>
        <div>
          Current: { year }.{ month }  { monthName }
        </div>
        <div onClick={() => this.nextMonth()}>Next</div>
        <div onClick={() => this.prevMonth()}>Prev</div>

        { this.renderWeeks(weeks) }
      </div>
    )
  }
}

export default Month;

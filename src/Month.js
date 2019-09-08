import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import CustomDate from './CustomDate';
import Days from './Days';
import time from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

class Month extends PureComponent{
  constructor(props){
    super(props)

    const { userStyles, colors } = this.props;
    let newStyles = time.getStyles(getStyles, userStyles, colors);

    this.days = new Days(colors, userStyles);

    this.state = {
      start: false,
      end: false,
      styles: newStyles
    }
  }

  reset(){
    this.setState({ start: false, end: false})
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

  render(){
    const { start, end, styles } = this.state;
    const { month, year, maxDate, minDate, maxRange, minRange } = this.props;

    // calendar has limits, if date is before minLimit or after maxLimit - it will become unavailable to select
    // limits calculates from minDate / maxDate or minRange / maxRange (false values == no limits)
    // if you have chosen start date, then all dates that before start + minRange or after start + maxRange will become
    // unavailable to select too
    let maxLimit = maxDate ? new CustomDate(maxDate) : false
    let minLimit = minDate ? new CustomDate(minDate) : false

    if(start){
      if(minRange){
        minLimit = start.addDays(minRange - 1);
      }

      if(maxRange){
        let newMaxLimit = start.addDays(maxRange - 1);
        maxLimit = maxLimit && maxLimit.isBefore(newMaxLimit) ? maxLimit : newMaxLimit;
      }
    }

    // here we get array of weeks with dates of chosen month
    let weeks = time.getMonth(year, month);
    let weeksCount = weeks.length - 1;

    // we iterate calendar page, this variables shows if iteration has reached start and end of selected date range
    let startReached = false, endReached = false;
    // just to prevent unnecessary iterations
    let beforeMinLimit = !!minLimit;
    // this is the first date in our calendar page(calendar page could also show some days from previous or next month
    // because we show every week that has at least one day from chosen month)
    let startDate = { day: weeks[0][0], month, year };
    // this is how we check if day from previous month
    if(weeks[0][0] > 7) startDate = time.subtractMonth(startDate)
    // if `start` and/or `end` of the range is before start of calendar page then
    // we have already reached them
    if(start && start.isBefore(startDate)) startReached = true;
    if(end && end.isBefore(startDate)) endReached = true;

    return weeks.map((week, weekIndex) => {
      return(<View style = {styles.week}>{
        week.map((day, dayIndex) => {
          let date = { day, month, year };
          // check if day is from previous or next month
          if(weekIndex === 0 && day > 7) date = time.subtractMonth(date);
          if(weekIndex === weeksCount && day < 7) date = time.addMonth(date);

          // isMain: days that should be marked(by default it is Sundays marked by red color)
          let params = { isMain: dayIndex === 0, callback: () => this.select(date) };

          if(beforeMinLimit){
            if(minLimit.isAfter(date)){
              params = {...params, callback: () => this.reset(), isUnavailable: true };
            }else{
              beforeMinLimit = true;
            }
          }

          if(maxLimit && maxLimit.isBefore(date)){
            params = {...params, callback: () => this.reset(), isUnavailable: true };
          }

          if(!startReached && start && start.isEqualTo(date)){
            startReached = true;
            params = {...params, isSelected: true, selectedBg: start && end ? "start" : "none", };
          }

          if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            params = {...params, isSelected: true, selectedBg: start && end ? "end" : "none", };
          }
          // if start reached but end - no, then this day in range
          if(end !== false && startReached && !endReached) params.inRange = true;

          return this.days.getDay(date, params);
        })
      }</View>)
    })
  }
}

const getStyles = (colors) => ({
  week: {
    flexDirection: 'row',
    height: weekHeight,
    marginBottom: weekPadding,
  },
});

export default Month;

import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import dateFormat from 'dateformat'
import CustomDate from './CustomDate';
import Days from './Days';
import helper from './helper';
import { MODE } from './constants';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

class Month extends PureComponent{
  constructor(props){
    super(props)

    const { userStyles, colors } = this.props;
    let newStyles = helper.mergeStyles(getStyles, userStyles, colors);

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

  formatDate(date){
    const { format } = this.props;

    if(date){
      let newDate = new Date(date.year, date.month, date.day);
      if(format){
        return dateFormat(newDate, format)
      }

      return newDate;
    }

    return date;
  }

  select(date){
    const { start, end } = this.state;
    const { mode, onDateChange } = this.props;

    let newDate = new CustomDate(date), newState = {};

    if(start !== false && end !== false){
      newState = { start: newDate, end: false};
    } else if(start === false){
      newState = { start: newDate};
    // if second selected date is after `start` then set this date as end, if not - set selected date as new `start`
    }else if(start.isBefore(newDate) && mode !== MODE.SINGLE){
      newState = { end: newDate};
    } else {
      newState = { start: newDate, end: false};
    }

    this.setState(newState, () => {
      if(MODE === MODE.SINGLE){
        onDateChange(this.formatDate(start));
      }else{
        onDateChange({ start: this.formatDate(this.state.start), end: this.formatDate(this.state.end) });
      }
    })
  }

  render(){
    const { start, end, styles } = this.state;
    const { month, year, maxDate, minDate, maxRange, minRange, mode, initialDate } = this.props;

    // calendar has limits, if date is before minLimit or after maxLimit - it will become unavailable to select
    // limits calculates from minDate / maxDate or minRange / maxRange (false values == no limits)
    // if you have chosen start date, then all dates that before start + minRange or after start + maxRange will become
    // unavailable to select too
    let maxLimit = maxDate ? new CustomDate(maxDate) : false;
    let minLimit = minDate ? new CustomDate(minDate) : false;

    if(start && mode !== MODE.SINGLE){
      if(minRange){
        minLimit = start.addDays(minRange + 1);
      }

      if(maxRange){
        let newMaxLimit = start.addDays(maxRange - 1);
        maxLimit = maxLimit && maxLimit.isBefore(newMaxLimit) ? maxLimit : newMaxLimit;
      }
    }

    // here we get array of weeks with dates of chosen month
    let weeks = helper.getMonth(year, month);
    let weeksCount = weeks.length - 1;

    let initialDay = new CustomDate(initialDate);

    // we iterate calendar page, this variables shows if iteration has reached `start` and `end` of selected date range
    let startReached = false, endReached = false;
    // just to prevent unnecessary iterations
    let beforeMinLimit = !!minLimit;
    // this is the first date in our calendar page(calendar page could also show some days from previous or next month
    // because we show every week that has at least one day from chosen month)
    let startDate = { day: weeks[0][0], month, year };
    // this is how we check if day from previous month
    if(weeks[0][0] > 7) startDate = helper.subtractMonth(startDate)
    // if `start` and/or `end` of the range is before start of calendar page then
    // we have already reached them
    if(start && start.isBefore(startDate)) startReached = true;
    if(end && end.isBefore(startDate)) endReached = true;

    return weeks.map((week, weekIndex) => {
      return(<View style = {styles.week} key = {week[0] + 'week'}>{
        week.map((day, dayIndex) => {
          let date = { day, month, year };
          // check if day is from previous or next month
          if(weekIndex === 0 && day > 7) date = helper.subtractMonth(date);
          if(weekIndex === weeksCount && day < 7) date = helper.addMonth(date);
          // isMain: days that should be marked(by default it is Sundays marked by red color)
          let params = {
            callback: () => this.select(date),
            key: "day" + day + "" + month,
            isMain: dayIndex === 0,
            testID: dayIndex === 0 ? 'weekend' : 'regular'
          };

          if(beforeMinLimit){
            if(minLimit.isAfter(date)){
              params = {...params, callback: () => this.reset(), isUnavailable: true, testID: 'unavailable' };
            }else{
              beforeMinLimit = true;
            }
          }

          if(initialDay.isEqualTo(date)) params.initial = true;

          if(maxLimit && maxLimit.isBefore(date)){
            params = {...params, callback: () => this.reset(), isUnavailable: true, testID: 'unavailable' };
          }
          // if start reached but end - no, then this day in range
          if(end !== false && startReached && !endReached) params = {...params, inRange: true, testID: 'ranged' };

          if(!startReached && start && start.isEqualTo(date)){
            startReached = true;
            params = {...params, isSelected: true, selectedBg: start && end ? "start" : "none", testID: 'selectedLeft' };
          }

          if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            params = {...params, isSelected: true, selectedBg: start && end ? "end" : "none", testID: 'selectedRight' };
          }

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

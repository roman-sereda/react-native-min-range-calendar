import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import CustomDate from './CustomDate';
import time from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

class Month extends PureComponent{
  constructor(props){
    super(props)

    const { userStyles, colors } = this.props;
    let newStyles = time.getStyles(getStyles, userStyles, colors);

    this.state = {
      start: false,
      end: false,
      styles: newStyles
    }
  }

  renderDate(date, params){
    const { colors } = this.props;
    const { start, end, styles } = this.state;

    const text = <Text
      style = {[
        styles.dayText,
        params.isMain ? styles.weekend : {},
        params.unavaliable ? styles.unavaliable : {},
        params.isBound ? styles.selectedDayText : {},
      ]}>
        { date.day }
      </Text>;

    const selectedBg = start === false || end === false ?
      null : <View style = {[
        styles.selectedBg,
        params.left ? styles.selectedEndBg : styles.selectedStartBg
      ]}/> ;

    const day = params.selected ?
      <View>
        { selectedBg }
        <View style = {styles.selected}>
          { text }
        </View>
      </View>
      : text;

    return <TouchableOpacity
      underlayColor="white"
      style = {[
        styles.day,
        params.range && !params.selected ? styles.rangedDay : {}
      ]}
      onPress = {params.unavaliable ? (e) => this.restore() : (e) => this.select(date)}>
      { day }
    </TouchableOpacity>
  }

  restore(){
    this.setState({ start: false, end: false})
  }

  select(date, ){
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

    let maxLimit = maxDate ? new CustomDate({ year: maxDate.getFullYear(), month: maxDate.getMonth(), day: maxDate.getDate() }) : false;
    let minLimit = minDate ? new CustomDate({ year: minDate.getFullYear(), month: minDate.getMonth(), day: minDate.getDate() }) : false;

    if(minRange && start){
      let lLimit = new Date(start.year, start.month, start.day);
      lLimit.setDate(lLimit.getDate() + minRange - 1);
      lLimit = new CustomDate({ year: lLimit.getFullYear(), month: lLimit.getMonth(), day: lLimit.getDate() })
      minLimit = lLimit
    }

    if(maxRange && start){
      let rLimit = new Date(start.year, start.month, start.day);
      rLimit.setDate(rLimit.getDate() + maxRange - 1);
      rLimit = new CustomDate({ year: rLimit.getFullYear(), month: rLimit.getMonth(), day: rLimit.getDate() })
      if(maxLimit){
        maxLimit = maxLimit.isBefore({ year: rLimit.getFullYear(), month: rLimit.getMonth(), day: rLimit.getDate() }) ? maxLimit : rLimit;
      }else{
        maxLimit = rLimit;
      }
    }

    let weeks = time.getMonth(year, month);

    // we iterate calendar page, this variables shows if iteration has reached
    // start and end of date range
    let startReached = false, endReached = false, beforeMinLimit = minLimit;
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

          let date = { day, month, year };
          let params = {}

          // check if day is from previous or next month
          if(weekIndex == 0 && day > 7) date = time.subtractMonth(date);
          if(weekIndex == weeksCount && day < 7) date = time.addMonth(date);

          if(beforeMinLimit){
            if(minLimit.isAfter(date)){
              params.unavaliable = true;
            }else{
              afterMinDate = true;
            }
          }

          if(maxLimit && maxLimit.isBefore(date)){
            params.unavaliable = true;
          }

          if(!startReached && start && start.isEqualTo(date)){
            console.log('ok')
            startReached = true;
            params.selected = true;
            params.left = true;
            params.isBound = true;
          }

          if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            params.selected = true;
            params.left = false;
            params.isBound = true;
          }

          // if start reached but end - no, then this day in range
          if(end !== false && startReached && !endReached){
            params.range = true;
          }

          params.isMain = dayIndex == 0;

          return this.renderDate(date, params);
        })
      }</View>)
    })
  }
}

export default Month;

const getStyles = (colors) => ({
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
    color: colors.dayText,
  },
  selected: {
    width: weekHeight + weekPadding,
    height: weekHeight + weekPadding,
    backgroundColor: colors.selectedDayBg,
    borderRadius: (weekHeight + weekPadding) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBg: {
    position: 'absolute',
    top: weekPadding / 2,
    backgroundColor: colors.rangeBg,
    width: '50%',
    height: weekHeight
  },
  selectedStartBg: {
    left: '-25%'
  },
  selectedEndBg: {
    right: '-25%'
  },
  selectedDayText: {
    color: colors.selectedDay,
  },
  weekend: {
    color: colors.weekend,
  },
  rangedDay: {
    backgroundColor: colors.rangeBg,
  },
  unavaliable: {
    color: colors.unavaliable,
  }
});

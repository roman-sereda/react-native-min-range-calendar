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
        params.isBound ? styles.selectedDayText : {},
        params.unavaliable ? styles.unavaliable : {},
      ]}>
        { date.day }
      </Text>;

    const selectedBg = start === false || end === false ?
      null : <View style = {[
        styles.selectedBg,
        date.left ? styles.selectedEndBg : styles.selectedStartBg
      ]}/> ;

    const day = date.selected ?
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
        params.range ? { backgroundColor: colors.rangeBg } : {},
        params.range ? styles.rangedDay : {}
      ]}
      onPress = {params.unavaliable ? null : (e) => this.select(date)}>
      { day }
    </TouchableOpacity>
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
    const { month, year, maxDate, minDate } = this.props;

    let maxD = maxDate ? new CustomDate({ year: maxDate.getFullYear(), month: maxDate.getMonth(), day: maxDate.getDate() }) : false;
    let minD = minDate ? new CustomDate({ year: minDate.getFullYear(), month: minDate.getMonth(), day: minDate.getDate() }) : false;

    let weeks = time.getMonth(year, month);

    // we iterate calendar page, this variables shows if iteration has reached
    // start and end of date range
    let startReached = false, endReached = false, afterMinDate = minD ? false : true;
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

          if(!afterMinDate){
            if(minD.isAfter(date)){
              return this.renderDate(date, { unavaliable: true });
            }else{
              afterMinDate = true;
            }
          }

          if(maxD.isBefore(date)){
            return this.renderDate(date, { unavaliable: true });
          }

          if(!startReached && start && start.isEqualTo(date)){
            startReached = true;
            date.selected = true;
            date.left = true;
            return this.renderDate(date, { isBound: true });
          }

          if(!endReached && end && end.isEqualTo(date)){
            endReached = true;
            date.selected = true;
            return this.renderDate(date, { isBound: true });
          }

          // if start reached but end - no, then this day in range
          if(end !== false && startReached && !endReached){
            return this.renderDate(date, { range: true, isMain: dayIndex == 0 });
          }

          return this.renderDate(date, { isMain: dayIndex == 0 });
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

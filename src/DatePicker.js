import React, { Component } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Month from './Month';
import helper from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

class DatePicker extends Component{
  constructor(props){
    super(props);

    const { locale, userColors, userStyles, initialDate } = this.props;

    let newColors = helper.mergeColors(userColors);
    let newStyles = helper.mergeStyles(getStyles, userStyles, newColors);

    this.state = {
      styles: newStyles,
      colors: newColors,
      dayNames: helper.getDayNames(locale),
      monthNames: helper.getMonthNames(locale),
      month: initialDate.getMonth(),
      year: initialDate.getFullYear(),
      fade: new Animated.Value(1),
    };
  }

  renderDaysOfTheWeek(){
    const { dayNames, styles } = this.state;

    return(
      <View style = {styles.week}>
        { dayNames.map(day => {
          return <View style = {styles.day} key = {"name" + day}>
            <Text style = {styles.dayNames}>
             { day }
            </Text>
          </View>
        }) }
      </View>
    )
  }

  fade(value){
    const { fade } = this.state;
    const { fadeDuration } = this.props;

    return new Promise((resolve, reject) => {
      Animated.timing(this.state.fade, { toValue: value, duration: fadeDuration / 2 })
      .start(() => {
        resolve();
      });
    });
  }

  switchMonth(date){
    this.fade(0).then(() => {

      this.setState({ month: date.month, year: date.year }, () => {
        this.fade(1);
      });
    })
  }

  nextMonth(){
    const { month, year, fade } = this.state;

    this.switchMonth(helper.addMonth({ month, year }));
  }

  prevMonth(){
    const { month, year, fade } = this.state;

    this.switchMonth(helper.subtractMonth({ month, year }));
  }

  renderTopBar(){
    const { year, month, styles, monthNames, fade } = this.state;
    const { leftControl, rightControl } = this.props;

    let monthName = monthNames[month] || "-";

    return (
        <View style = {styles.topBar}>
          <TouchableOpacity
              testID="leftController"
              style = {[ styles.leftControl, styles.controls ]} onPress={() => this.prevMonth()}>
            { leftControl }
          </TouchableOpacity>
          <Animated.View style = {[styles.head, { opacity: fade } ]}>
            <Text style = {styles.subtitle}>{ year }</Text>
            <Text style = {styles.title}>{ monthName }</Text>
          </Animated.View>
          <TouchableOpacity
              testID="rightController"
              style = {[ styles.rightControl, styles.controls ]} onPress={() => this.nextMonth()}>
            { rightControl }
          </TouchableOpacity>
        </View>
    )
  }

  renderCalendar(){
    const { month, year, colors } = this.state;
    const { userStyles, minDate, maxDate, maxRange, minRange, mode, onDateChange, format, initialDate } = this.props;

    let pickerMode = ['single', 'range', 'both'].indexOf(mode) + 1;
    if(pickerMode === -1) pickerMode = 2;

    return(
      <Month
        initialDate = {initialDate}
        colors = {colors}
        userStyles = {userStyles}
        year = {year}
        onDateChange = {onDateChange}
        mode = {pickerMode}
        format = {format}
        month = {month}
        minDate = {minDate} maxDate = {maxDate}
        minRange = {minRange} maxRange = {maxRange}
      />
    )
  }

  render(){
    const { styles, fade } = this.state;

    return(
      <View style = {styles.wrapper}>
        { this.renderTopBar() }
        <View style = {styles.calendar}>
          { this.renderDaysOfTheWeek() }
          <Animated.View style = {{ opacity: fade }}>
            { this.renderCalendar() }
          </Animated.View>
        </View>
      </View>
    )
  }
}

DatePicker.defaultProps = {
  locale: 'en',
  format: false,
  userColors: {},
  userStyles: {},
  fadeDuration: 300,
  mode: 'both',
  onDateChange: () => {},
  maxRange: false,
  minRange: false,
  maxDate: false,
  minDate: false,
  initialDate: new Date(),
  leftControl: <Text>{ "<" }</Text>,
  rightControl: <Text>{ ">" }</Text>,
}

DatePicker.propTypes = {
  locale: PropTypes.string,
  format: PropTypes.oneOfType([ PropTypes.string, PropTypes.oneOf([false]) ]),
  userColors: PropTypes.object,
  userStyles: PropTypes.object,
  fadeDuration: PropTypes.number,
  mode: PropTypes.oneOf([ 'both', 'single', 'range' ]),
  onDateChange: PropTypes.func,
  maxRange: PropTypes.oneOfType([ PropTypes.number, PropTypes.oneOf([false]) ]),
  minRange: PropTypes.oneOfType([ PropTypes.number, PropTypes.oneOf([false]) ]),
  maxDate: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.oneOf([false]) ]),
  minDate: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.oneOf([false]) ]),
  initialDate: PropTypes.instanceOf(Date),
  leftControl: PropTypes.node,
  rightControl: PropTypes.node,
};

const getStyles = (colors) => ({
  wrapper: {
    paddingBottom: 10,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  topBar: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.title
  },
  subtitle: {
    color: colors.subtitle,
    fontSize: 13,
  },
  head: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  day: {
    width: "14.2857142857%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    height: height,
  },
  week: {
    flexDirection: 'row',
    height: weekHeight,
    marginBottom: weekPadding,
  },
  dayNames: {
    color: colors.dayNames
  },
  controls: {
    flex: 1,
    justifyContent: 'center'
  },
  controlsText: {

  },
  leftControl: {
    paddingLeft: 10,
  },
  rightControl: {
    alignItems: 'flex-end',
    paddingRight: 10,
  }
});

export default DatePicker;

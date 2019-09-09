import React, { PureComponent } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Month from './Month';
import helper from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

class DatePicker extends PureComponent{
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

  renderDayNames(){
    const { dayNames, styles } = this.state;

    return dayNames.map(day => {
      return <View style = {styles.day}>
        <Text style = {styles.dayNames}>
          { day }
        </Text>
      </View>
    });
  }

  fadeIn(){
    const { fade } = this.state;
    const { fadeDuration } = this.props;

    return new Promise((resolve, reject) => {
      Animated.timing(this.state.fade, { toValue: 0, duration: fadeDuration / 2 })
      .start(() => {
        resolve();
      });
    });
  }

  fadeOut(){
    const { fade } = this.state;
    const { fadeDuration } = this.props;

    return new Promise((resolve, reject) => {
      Animated.timing(this.state.fade, { toValue: 1, duration: fadeDuration / 2 })
      .start(() => {
        resolve();
      });
    });
  }

  nextMonth(){
    const { month, year, fade } = this.state;

    this.fadeIn().then(() => {
      let date = helper.addMonth({ month, year });
      this.setState({ month: date.month, year: date.year }, () => {
        this.fadeOut();
      });
    })
  }

  prevMonth(){
    const { month, year, fade } = this.state;

    this.fadeIn().then(() => {
      let date = helper.subtractMonth({ month, year });
      this.setState({ month: date.month, year: date.year }, () => {
        this.fadeOut();
      });
    })
  }

  render(){
    const { monthNames, month, year, styles, colors, fade } = this.state;
    const { userColors, userStyles, minDate, maxDate, maxRange, minRange, mode, onDateChange, format, initialDate, leftControl, rightControl } = this.props;

    let pickerMode = ['single', 'range', 'both'].indexOf(mode) + 1;
    if(pickerMode === -1) pickerMode = 2;

    let monthName = monthNames[month] || "-";

    return(
      <View style = {styles.wrapper}>
        <View style = {styles.topBar}>
          <TouchableOpacity style = {[ styles.leftControl, styles.controls ]} onPress={() => this.prevMonth()}>
           { leftControl }
          </TouchableOpacity>
          <Animated.View style = {[styles.head, { opacity: fade } ]}>
            <Text style = {styles.subtitle}>
              { year }
            </Text>
            <Text style = {styles.title}>
              { monthName }
            </Text>
          </Animated.View>
          <TouchableOpacity style = {[ styles.rightControl, styles.controls ]} onPress={() => this.nextMonth()}>
            { rightControl }
          </TouchableOpacity>
        </View>
        <View style = {styles.calendar}>
          <View style = {styles.week}>
            { this.renderDayNames() }
          </View>
          <Animated.View style = {{ opacity: fade }}>
            <Month
              initialDate = {initialDate}
              colors = {colors}
              userStyles = {userStyles}
              year = {year}
              onDateChange = {onDateChange}
              mode = {pickerMode}
              format = {format}
              month = {month}
              minDate = {minDate}
              maxDate = {maxDate}
              maxRange = {maxRange}
              minRange = {minRange}
            />
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

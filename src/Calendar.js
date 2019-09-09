import React, { PureComponent } from 'react';
import Month from './Month';
import { Text, View, Animated } from 'react-native';
import time from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

export default class extends PureComponent{
  static defaultProps = {
    userStyles: {},
    userColors: {},
    fadeDuration: 300,
    mode: 'both',
    maxRange: 13,
    minRange: 5,
    format: false,
    minDate: new Date(2019, 8, 4),
    maxDate: false,
  }

  constructor(props){
    super(props)

    const { locale, userColors, userStyles } = this.props;

    let newColors = time.getColors(styleColors, userColors);
    let newStyles = time.getStyles(getStyles, userStyles, newColors);

    this.state = {
      locale: locale,
      styles: newStyles,
      colors: newColors,
      onDateChange: () => {},
      dayNames: time.getDayNames(locale),
      monthNames: time.getMonthNames(locale),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
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
      let date = time.addMonth({ month, year });
      this.setState({ month: date.month, year: date.year }, () => {
        this.fadeOut();
      });
    })
  }

  prevMonth(){
    const { month, year, fade } = this.state;

    this.fadeIn().then(() => {
      let date = time.subtractMonth({ month, year });
      this.setState({ month: date.month, year: date.year }, () => {
        this.fadeOut();
      });
    })
  }

  render(){
    const { monthNames, month, year, styles, colors, fade } = this.state;
    const { userColors, userStyles, minDate, maxDate, maxRange, minRange, mode, onDateChange, format } = this.props;

    let pickerMode = ['single', 'range', 'both'].indexOf(mode) + 1;
    if(pickerMode === -1) pickerMode = 2;

    let monthName = monthNames[month] || "-";

    return(
      <View style = {styles.wrapper}>
        <View style = {styles.topBar}>
          <Text
            style = {styles.navigation}
            onPress={() => this.prevMonth()}>
            { "<" }
          </Text>
          <Animated.View style = {{ opacity: fade }}>
            <Text style = {styles.title}>
              { monthName }
            </Text>
          </Animated.View>
          <Text
            style = {styles.navigation}
            onPress={() => this.nextMonth()}>
            { ">" }
          </Text>
        </View>
        <View style = {styles.calendar}>
          <View style = {styles.week}>
            { this.renderDayNames() }
          </View>
          <Animated.View style = {{ opacity: fade }}>
            <Month
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

const styleColors = {
  rangeBg: '#edf4ff',
  dayNames: '#b5b7b9',
  title: '#10245c',
  dayText: '#53628c',
  selectedDayBg: '#488eff',
  selectedDay: 'white',
  weekend: '#df6565',
  unavaliable: '#c6c7c8'
}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.title
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
  }
});

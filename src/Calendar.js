import React, { PureComponent } from 'react';
import Month from './Month';
import { Text, View } from 'react-native';
import time from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

export default class extends PureComponent{
  static defaultProps = {
    userStyles: {},
    userColors: {}
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
      dayNames: time.getDayNames(locale),
      monthNames: time.getMonthNames(locale),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
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
    const { monthNames, month, year, styles, colors } = this.state;
    const { userColors, userStyles } = this.props;

    let monthName = monthNames[month] || "-";

    console.log(colors)

    return(
      <View style = {styles.wrapper}>
        <View style = {styles.topBar}>
          <Text
            style = {styles.navigation}
            onPress={() => this.prevMonth()}>
            { "<" }
          </Text>
          <Text style = {styles.title}>
            { monthName }
          </Text>
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
          <Month
            colors = {colors}
            userStyles = {userStyles}
            year = {year}
            month = {month}
          />
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

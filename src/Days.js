import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import helper from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

export default class {
  constructor(colors, userStyles, select, reset) {
    this.styles = helper.mergeStyles(getStyles, userStyles, colors);
    this.select = select;
    this.reset = reset;
  }

  selectedDay(props){
    let style = {}, bg = null;

    let params = { date: props.date, key: props.key, testID: 'selected', style: {} };

    if(props.back){
      if(props.side === "left"){
        style = this.styles.selectedStartBg;
        params.testID = 'selectedLeft';
      }
      if(props.side === "right"){
        style = this.styles.selectedEndBg;
        params.testID = 'selectedRight';
      }

      bg = <View style = {[ this.styles.selectedBg, style ]}/>
    }

    let date = this.getText(props.date.day, this.styles.selectedText);
    let dayWrapper = <View>{ bg }{ this.getCircle(date, this.styles.selected) }</View>;

    return this.getWrapper(dayWrapper, params);
  }

  rangedDay(props){
    let day = this.getText(props.date.day, this.styles.rangedText);
    let params = { date: props.date, key: props.key, testID: 'ranged', style: this.styles.ranged };
    console.log(params)
    return this.getWrapper(day, params);
  }

  unAvailableDay(props){
    let day = this.getText(props.date.day, this.styles.unavailableText);
    let params = { date: props.date, key: props.key, testID: 'unavailable', callback: this.reset };
    return this.getWrapper(day, params);
  }

  initialDay(props){
    let day = this.getText(props.date.day, this.styles.initialDayText);
    let params = { date: props.date, key: props.key, testID: 'initial', style: this.styles.initialDay };
    return this.getWrapper(day, params);
  }

  regularDay(props){
    let day = this.getText(props.date.day, props.isWeekend ? this.styles.mainText : {});
    let params = { date: props.date, key: props.key, testID: props.isWeekend ? "weekend" : "regular", style: {} };
    return this.getWrapper(day, params);
  }

  getDay(props) {

    if(props.isSelected) return this.selectedDay(props);
    if(props.isRanged) return this.rangedDay(props);
    if(props.isUnavailable) return this.unAvailableDay(props);
    if(props.isInitial) return this.initialDay(props);

    return this.regularDay(props);
  }

  getText(day, style = {}) {
    return (
        <Text style={[this.styles.dayText, style]}>
          {day}
        </Text>
    );
  }

  getWrapper(child, props) {
    console.log(props)
    return (
      <TouchableOpacity
          underlayColor="white"
          style={[ this.styles.day, props.style ]}
          onPress={props.callback ? () => props.callback() : () => this.select(props.date) }
          testID = {props.testID}
          key = {props.key}
      >
        {child}
      </TouchableOpacity>
    );
  }

  getCircle(child, style = {}){
    return <View style = {[ this.styles.circle, style ]}>{ child }</View>
  }
}

const getStyles = (colors) => ({
  day: {
    width: "14.2857142857%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBg: {
    position: 'absolute',
    top: weekPadding / 2,
    backgroundColor: colors.range,
    width: '50%',
    height: weekHeight
  },
  selectedEndBg: {
    left: '-25%'
  },
  selectedStartBg: {
    right: '-25%'
  },
  circle: {
    width: weekHeight + weekPadding,
    height: weekHeight + weekPadding,
    borderRadius: (weekHeight + weekPadding) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.selectedDay,
  },
  initial: {
    borderWidth: 0.5,
    backgroundColor: 'none',
    borderColor: colors.selectedDay,
  },
  ranged: {
    backgroundColor: colors.range,
  },
  dayText: {
    color: colors.dayText,
  },
  selectedText: {
    color: colors.selectedDayText,
  },
  mainText: {
    color: colors.weekend,
  },
  rangedText: {
    color: colors.rangeText,
  },
  unavailableText: {
    color: colors.unavailable,
  },
  initialDay: {
    borderBottomColor: colors.initialText,
    borderBottomWidth: 3,
  },
  initialDayText: {
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  }
});

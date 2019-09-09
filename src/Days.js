import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import helper from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

export default class {
  constructor(colors, userStyles) {
    this.styles = helper.mergeStyles(getStyles, userStyles, colors);
  }

  getDay(date, params) {
    const { isSelected, isMain, isUnavailable, inRange, callback, initial } = params;
    const { styles } = this;

    let textStyle = {}, wrapperStyle = {};

    if(isMain) textStyle = styles.mainText;
    if(isUnavailable) textStyle = styles.unavailableText;
    if(inRange) textStyle = styles.rangedText
    if(isSelected) textStyle = styles.selectedText;
    if(inRange && !isSelected) wrapperStyle = styles.ranged
    if(initial && !isSelected && !inRange) wrapperStyle = styles.initialDay;

    if(initial && !isSelected) textStyle = {...textStyle, ...styles.initialDayText };

    let day = this.getText(date.day, textStyle);
    if(isSelected) day = this.setSeleceted(day, params.selectedBg);
    return this.getWrapper(day, wrapperStyle, callback);
  }

  getText(day, style = {}) {
    return (
      <Text style={[this.styles.dayText, style]}>
        {day}
      </Text>
    );
  }

  getWrapper(child, style = {}, callback) {
    return (
      <TouchableOpacity
          underlayColor="white"
          style={[ this.styles.day, style ]}
          onPress={callback}
      >
        {child}
      </TouchableOpacity>
    );
  }

  getCircle(child, style = {}){
    return <View style = {[ this.styles.circle, style ]}>{ child }</View>
  }

  setSeleceted(child, selectedBg){

    let style = {}, bg = null;

    if(selectedBg === "start") style = this.styles.selectedStartBg;
    if(selectedBg === "end") style = this.styles.selectedEndBg;

    if(selectedBg !== "none"){
      bg = <View style = {[ this.styles.selectedBg, style ]}/>
    }

    return(
      <View>
        { bg }
        { this.getCircle(child, this.styles.selected) }
      </View>
    );
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

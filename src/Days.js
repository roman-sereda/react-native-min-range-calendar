import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import time from './helper';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

export default class {
  constructor(colors, userStyles) {
    this.styles = time.getStyles(getStyles, userStyles, colors);
  }

  getDay(date, params) {
    console.log(params)
    const { isSelected, isMain, isUnavailable, inRange, callback } = params;
    const { styles } = this;

    let textStyle = {}, wrapperStyle = {};

    if(isMain) textStyle = styles.mainText;
    if(isUnavailable) textStyle = styles.unavailableText;
    if(inRange) textStyle = styles.rangedText
    if(isSelected) textStyle = styles.selectedText;
    if(inRange && !isSelected) wrapperStyle = styles.ranged

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
        <View style = {this.styles.selected}>
          { child }
        </View>
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
    backgroundColor: colors.rangeBg,
    width: '50%',
    height: weekHeight
  },
  selectedEndBg: {
    left: '-25%'
  },
  selectedStartBg: {
    right: '-25%'
  },
  selected: {
    width: weekHeight + weekPadding,
    height: weekHeight + weekPadding,
    backgroundColor: colors.selectedDayBg,
    borderRadius: (weekHeight + weekPadding) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ranged: {
    backgroundColor: colors.rangeBg,
  },
  dayText: {
    color: colors.dayText,
  },
  selectedText: {
    color: colors.selectedDay,
  },
  mainText: {
    color: colors.weekend,
  },
  rangedText: {
    color: 'green',
  },
  unavailableText: {
    color: colors.unavaliable,
  }
});

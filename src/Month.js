import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import dateFormat from 'dateformat'
import CustomDate from './CustomDate';
import Days from './Days';
import helper from './helper';
import { MODE } from './constants';
import Dates from './Dates';

const weekHeight = 30, weekPadding = 7;
const height = 6 * weekHeight + weekPadding * 5;

class Month extends PureComponent{
  constructor(props){
    super(props);

    const { userStyles, colors } = this.props;
    let newStyles = helper.mergeStyles(getStyles, userStyles, colors);

    this.days = new Days(colors, userStyles, (date) => this.select(date), () => this.reset());

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

  getNewRangeState(newDate, mode){
    const { start, end } = this.state;

    if(start !== false && end === false && start.isBefore(newDate) && mode !== MODE.SINGLE){
      return { end: newDate };
    }

    return { start: newDate, end: false};
  }

  select(date){
    const { onDateChange, mode } = this.props;

    let newState = this.getNewRangeState(new CustomDate(date), mode);

    this.setState(newState, () => {
      if(mode === MODE.SINGLE){
        onDateChange(this.formatDate(this.state.start));
      }else{
        onDateChange({ start: this.formatDate(this.state.start), end: this.formatDate(this.state.end) });
      }
    })
  }

  render(){
    const { styles } = this.state;

    let dates = new Dates(this.props, this.state);
    let weeks = dates.getDates();

    return weeks.map((week, weekIndex) => {
      return(<View style = {styles.week} key = {week[0].date.day + ' week' + week[0].date.month}>{
        week.map((props, dayIndex) => {
          props.key = props.date.day + " " + props.date.month;
          return this.days.getDay(props);
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

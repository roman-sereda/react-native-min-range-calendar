import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import dateFormat from 'dateformat'
import CustomDate from '../CustomDate';
import helper from '../helper';
import { MODE } from '../constants';
import Days from './Dates';

class DatePicker extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      start: false,
      end: false,
    };

    this.dates = new Days((date) => this.select(date), () => this.reset());
    this.updateDates();
  }

  componentDidUpdate(prevProps){
    const { userStyles, rowHeight, rowPadding } = this.props;

    if (prevProps.userStyles !== userStyles || prevProps.colors !== userStyles.colors ||
        prevProps.rowHeight !== rowHeight || prevProps.rowPadding !== rowPadding) {

      this.updateDates();
    }
  }

  updateDates(){
    const { userStyles, colors, rowHeight, rowPadding } = this.props;
    this.dates.update(userStyles, colors, rowHeight, rowPadding );
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

  sendCallback(){
    const { mode, onDateChange } = this.props;
    const { start, end } = this.state;

    if(mode === MODE.SINGLE){
      onDateChange(this.formatDate(start));
    }else{
      onDateChange({ start: this.formatDate(start), end: this.formatDate(end) });
    }
  }

  select(date){
    const { mode } = this.props;
    const { start, end } = this.state;

    let newDate = new CustomDate(date), newState = {};

    if(start !== false && end === false && start.isBefore(newDate) && mode !== MODE.SINGLE){
      newState = { end: newDate };
    }else{
      newState = { start: newDate, end: false };
    }

    this.setState(newState, () => { this.sendCallback() });
  }

  render(){
    const { start, end } = this.state;

    let params = Object.assign({}, this.props);
    params.start = start;
    params.end = end;

    return this.dates.getDates(params);
  }
}

export default DatePicker;

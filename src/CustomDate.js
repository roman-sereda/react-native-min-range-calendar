const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getDaysInMonth = (month, year) => {
  return year % 4 === 0 && month === 1 ? 28 : maxDays[month];
}

class CustomDate{
  constructor(date){
    this.set(date);
  }

  set(date){
    if(date instanceof Date){
      this.setFromDate(date);
    }else{
      this.year = date.year;
      this.month = date.month;
      this.day = date.day;
    }
  }

  isBefore(date){
    const { year, month, day } = date;

    return this.year < year || (year === this.year &&
      (this.month < month || (month === this.month && this.day < day)))
  }

  isAfter(date){
    const { year, month, day } = date;

    return this.year > year || (year === this.year &&
      (this.month > month || (month === this.month && this.day > day)))
  }

  isEqualTo(date){
    const { year, month, day } = date;

    return year === this.year && month === this.month && day === this.day;
  }

  setFromDate(date){
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.day = date.getDate();
  }

  addDays(value){
    let newDate = this.getDateObject();
    newDate.setDate(newDate.getDate() + value);
    return new CustomDate(newDate);
  }

  getDateObject(){
    return new Date(this.year, this.month, this.day);
  }
}

export default CustomDate;

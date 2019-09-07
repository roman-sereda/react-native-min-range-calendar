export default class{
  constructor(date){
    this.year = date.year;
    this.month = date.month;
    this.day = date.day;
  }

  isBefore(date){
    const { year, month, day } = date;

    return this.year < year || (year == this.year &&
      (this.month < month || (month == this.month && this.day < day)))
  }

  isAfter(date){
    const { year, month, day } = date;

    return this.year > year || (year == this.year &&
      (this.month > month || (month == this.month && this.day > day)))
  }

  isEqualTo(date){
    const { year, month, day } = date;

    return year == this.year && month == this.month && day == this.day;
  }
}

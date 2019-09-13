import CustomDate from "./CustomDate";
import helper from "./helper";
import { MODE } from "./constants";
import {View} from "react-native";

export default class Dates{
    constructor(props, state){

        this.props = props;
        this.state = state;
    };
    /* calendar has limits, if date is before minLimit or after maxLimit - it will become unavailable to select
   limits calculates from minDate / maxDate or minRange / maxRange (false values == no limits)
   if you have chosen start date, then all dates that before start + minRange or after start + maxRange will become
   unavailable to select too */
    calculateBoundaries(){
        const { start } = this.state;
        const { minRange, maxRange, minDate, maxDate, mode } = this.props;

        let maxLimit = maxDate ? new CustomDate(maxDate) : false;
        let minLimit = minDate ? new CustomDate(minDate) : false;

        if(start && mode !== MODE.SINGLE){
            if(minRange) minLimit = start.addDays(minRange + 1);

            if(maxRange){
                let newMaxLimit = start.addDays(maxRange - 1);
                maxLimit = maxLimit && maxLimit.isBefore(newMaxLimit) ? maxLimit : newMaxLimit;
            }

            let newMinLimit = start;
            minLimit = minLimit && minLimit.isAfter(newMinLimit) ? minLimit : newMinLimit;
        }

        return { maxLimit, minLimit };
    }

    isBeforeMinLimit(date){
        if(this.beforeMinLimit){
            if(this.minLimit.isAfter(date)){
                return true;
            }else{
                this.beforeMinLimit = false;
            }
        }

        return false;
    }

    isAfterMaxLimit(date){
        return this.maxLimit && this.maxLimit.isBefore(date);
    }

    prepareParams(){
        const { start, end } = this.state;
        const { month, year, initialDate } = this.props;
        const { minLimit, maxLimit } = this.calculateBoundaries();

        this.maxLimit = maxLimit;
        this.minLimit = minLimit;
        // here we get array of weeks with dates of chosen month
        this.weeks = helper.getMonth(year, month);
        this.weeksCount = this.weeks.length - 1;
        this.initialDay = new CustomDate(initialDate);
        // we iterate calendar page, this variables shows if iteration has reached `start` and `end` of selected date range
        this.startReached = false, this.endReached = false;
        // just to prevent unnecessary iterations
        this.beforeMinLimit = !!minLimit;
        // this is the first date in our calendar page(calendar page could also show some days from previous or next month
        // because we show every week that has at least one day from chosen month)
        this.startDate = { day: this.weeks[0][0], month, year };
        // this is how we check if day from previous month
        if(this.weeks[0][0] > 7) this.startDate = helper.subtractMonth(this.startDate)
        // if `start` and/or `end` of the range is before start of calendar page then
        // we have already reached them
        if(start && start.isBefore(this.startDate)) this.startReached = true;
        if(end && end.isBefore(this.startDate)) this.endReached = true;
    }

    getFullDate(day, weekIndex){
        const { month, year } = this.props;

        let date = { day, month, year };
        // check if day is from previous or next month
        if(weekIndex === 0 && day > 7) date = helper.subtractMonth(date);
        if(weekIndex === this.weeksCount && day < 7) date = helper.addMonth(date);

        return date;
    }

    chooseType(date, dayIndex){
        const { start, end } = this.state;
        let params = {};

        params = { date, isWeekend: dayIndex === 0 };
        if(this.initialDay.isEqualTo(date)) params = { date, isInitial: true };
        if(this.isBeforeMinLimit(date) || this.isAfterMaxLimit(date)){
            params = { date, isUnavailable: true };
        }
        if(end !== false && this.startReached && !this.endReached) params = { date, isRanged: true };

        if(!this.startReached && start && start.isEqualTo(date)){
            this.startReached = true;
            params = { date, isSelected: true, side: 'left', back: start && end }
        }

        if(!this.endReached && end && end.isEqualTo(date)){
            this.endReached = true;
            params = { date, isSelected: true, side: 'right', back: start && end };
        }

        return params;
    }

    getDates(){
        const { month, year } = this.props;
        const { styles, start, end } = this.state;

        this.prepareParams();

        let weeks = helper.getMonth(year, month);

        return weeks.map((week, weekIndex) => {
            return week.map((day, dayIndex) => {

                let date = this.getFullDate(day, weekIndex);
                return this.chooseType(date, dayIndex);
            })
        })
    }
}

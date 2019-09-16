import helper from "../src/helper";
import { colors } from "../src/constants";
import CustomDate from "../src/CustomDate";

test("'mergeColors' should replace old colors with new", () => {
    const colors = { weekend: 'gray', title: 'yellow' };

    const newColors = helper.mergeColors(colors);

    expect(newColors.weekend).toBe("gray");
});

test("'mergeStyles' should replace old styles with new", () => {

    const colors = { red: 'red', blue: 'blue' };
    const firstStyles = (colors) =>  ({ bar: { opacity: 1, color: colors.red }, goo: { height: 10 } });
    const secondStyles = { bar: { opacity: 0, backgroundColor: 'blue' }, foo: { width: 10 } };

    const newStyles = helper.mergeStyles(firstStyles, secondStyles, colors);

    expect(newStyles).toHaveProperty("bar");
    expect(newStyles.bar.opacity).toBe(0);
    expect(newStyles.bar.color).toBe(colors.red);

    expect(newStyles).not.toHaveProperty("foo");
    expect(newStyles).toHaveProperty("goo");
});

const compareCalendars = (year, month, correctArray) => {
    let prevMonth = month, prevYear = year, nextMonth = month, nextYear = year, failed = false;

    nextMonth++;
    if(nextMonth > 11){
        nextMonth = 0;
        nextYear++;
    }

    prevMonth--;
    if(prevMonth < 0){
        prevMonth = 11;
        prevYear--;
    }

    const weeks = helper.getMonth(year, month);

    for(let i = 0; i < weeks.length; i++){
        for(let j = 0; j < weeks[i].length; j++){
            let d = weeks[i][j];

            if(d.day !== correctArray[i][j]) failed = true;

            if(i === 0 && d.day > 7){
                if(d.month !== prevMonth || d.year !== prevYear) failed = true;
            } else if(i === weeks.length - 1 && d.day < 7){
                if(d.month !== nextMonth || d.year !== nextYear) failed = true;
            } else {
                if(d.month !== month || d.year !== year) failed = true;
            }

            console.log(d, year, month, correctArray[i][j],failed)
        }
    }

    expect(failed).toBe(false);
};

test("'getMonth' should return correct array of weeks with dates", () => {

    let correctArray =  [ [ 1, 2, 3, 4, 5, 6, 7 ],
        [ 8, 9, 10, 11, 12, 13, 14 ],
        [ 15, 16, 17, 18, 19, 20, 21 ],
        [ 22, 23, 24, 25, 26, 27, 28 ],
        [ 29, 30, 1, 2, 3, 4, 5 ] ];

    compareCalendars(2019, 8, correctArray);

    correctArray =  [ [ 30, 31, 1, 2, 3, 4, 5 ],
        [ 6, 7, 8, 9, 10, 11, 12 ],
        [ 13, 14, 15, 16, 17, 18, 19 ],
        [ 20, 21, 22, 23, 24, 25, 26 ],
        [ 27, 28, 29, 30, 31, 1, 2 ] ];

    compareCalendars(2019, 0, correctArray);

    correctArray =  [ [ 30, 1, 2, 3, 4, 5, 6 ],
        [ 7, 8, 9, 10, 11, 12, 13 ],
        [ 14, 15, 16, 17, 18, 19, 20 ],
        [ 21, 22, 23, 24, 25, 26, 27 ],
        [ 28, 29, 30, 31, 1, 2, 3 ] ];

    compareCalendars(2014, 11, correctArray);
});

test("'subtractMonth' should return object with subtracted month", () => {

    let date = { year: 2019, month: 0, day: 0 };

    let newDate = helper.subtractMonth(date);

    expect(newDate.year).toEqual(2018);
    expect(newDate.month).toEqual(11);
});

test("'addMonth' should return object with added month", () => {

    let date = { year: 2018, month: 11, day: 0 };

    let newDate = helper.addMonth(date);

    expect(newDate.year).toEqual(2019);
    expect(newDate.month).toEqual(0);
});



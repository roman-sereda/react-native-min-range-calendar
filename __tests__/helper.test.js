import helper from "../src/helper";
import colors from "../src/colors";
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

test("'getMonth' should return correct array of weeks with dates", () => {

    const weeks = helper.getMonth(2019, 8);

    const correctArray =  [ [ 1, 2, 3, 4, 5, 6, 7 ],
        [ 8, 9, 10, 11, 12, 13, 14 ],
        [ 15, 16, 17, 18, 19, 20, 21 ],
        [ 22, 23, 24, 25, 26, 27, 28 ],
        [ 29, 30, 1, 2, 3, 4, 5 ] ];

    expect(weeks).toStrictEqual(correctArray);
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



import Calendar from '../src/components/Calendar';
import Month from '../src/Month';
import React from 'react';
import helper from '../src/helper';
import { render, fireEvent } from 'react-native-testing-library';

describe("'Month' should ", () => {

    let { debug, queryByText, getByText, getAllByTestId } = render(<Calendar />);
    let weeks = helper.getMonth(new Date().getFullYear(), new Date().getMonth());

    /*it("render all dates", () => {

        let daysCounter = 0;
        weeks.forEach(week => {
            daysCounter += week.length;
        });

        expect(getAllByTestId("date").length).toEqual(daysCounter);
    });*/

    it("highlight sundays", () => {

        let sundays = weeks.length;
        expect(getAllByTestId("weekend").length).toEqual(sundays);
    });

    it("highlight selected dates", () => {

        fireEvent.press(getByText("15"));
        expect(getAllByTestId("selected").length).toEqual(1);
        expect(queryByText("ranged")).toBeNull();

        fireEvent.press(getByText("25"));
        expect(getAllByTestId("selectedLeft").length).toEqual(1);
        expect(getAllByTestId("selectedRight").length).toEqual(1);
        expect(getAllByTestId("ranged").length).toEqual(9);
    });

    it("remove selected dates if clicked on unavailable date", () => {

        fireEvent.press(getAllByTestId("unavailable")[0]);
        expect(queryByText("selectedLeft")).toBeNull();
        expect(queryByText("selectedRight")).toBeNull();
    });
});

describe("Ranges should work correctly", () => {

    let { debug, queryByText, getByText, getAllByTestId } = render(
        <Calendar
            initialDate = { new Date(2019,1,1) }
            minRange = {1}
            maxRange = {5}
            minDate = {new Date(2019,1,9)}
            maxDate = {new Date(2019,1,20)}
        />
    );

    fireEvent.press(getByText("10"));
    fireEvent.press(getByText("17"));
    expect(queryByText("selectedRight")).toBeNull();
    expect(queryByText("selectedLeft")).toBeNull();

    fireEvent.press(getByText("10"));
    fireEvent.press(getByText("12"));
    expect(getAllByTestId("selectedLeft").length).toEqual(1);
    expect(getAllByTestId("selectedRight").length).toEqual(1);

    fireEvent.press(getByText("8"));
    expect(queryByText("selectedRight")).toBeNull();
    expect(queryByText("selectedLeft")).toBeNull();

    fireEvent.press(getByText("25"));
    expect(queryByText("selectedRight")).toBeNull();
    expect(queryByText("selectedLeft")).toBeNull();

});

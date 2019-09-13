import DatePicker from '../src/DatePicker';
import Month from '../src/Month';
import React from 'react';
import helper from '../src/helper';
import { render, fireEvent } from 'react-native-testing-library';

describe("'Month' should ", () => {

    let { debug, queryByText, getByText, getAllByTestId } = render(<DatePicker />);
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

    it("highlight sundays", () => {

        fireEvent.press(getByText("15"));
        expect(getAllByTestId("selectedLeft").length).toEqual(1);
        expect(queryByText("ranged")).toBeNull();

        fireEvent.press(getByText("25"));
        expect(getAllByTestId("selectedLeft").length).toEqual(1);
        expect(getAllByTestId("selectedRight").length).toEqual(1);
        expect(getAllByTestId("ranged").length).toEqual(9);
    });
});

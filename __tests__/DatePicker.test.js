import DatePicker from '../src/DatePicker';
import helper from '../src/helper';
import { render, fireEvent } from 'react-native-testing-library';
import React from 'react';
import { Text } from 'react-native';

jest.useFakeTimers();

let months = helper.getMonthNames('en');

describe("DatePicker with default props should", () => {

    const { debug, update, getByText, getByTestId, queryByText } = render(<DatePicker />);
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    it("render days of the week", () => {

        let days = helper.getDayNames('en');

        days.forEach(day => {
            getByText(day);
        });
    });

    it("render month name", () => {

        let month = months[currentMonth];

        getByText(month);
    });

    it("render year", () => {
        getByText(currentYear.toString());
    });

    it("should switch month after pressing next month", async () => {
        getByText(months[currentMonth]);

        fireEvent.press(getByTestId("rightController"));

        jest.runAllTimers();

        expect(queryByText(months[currentMonth])).toBeNull();
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        getByText(months[currentMonth]);
    });

    it("should switch month after pressing previous month", async () => {
        getByText(months[currentMonth]);

        fireEvent.press(getByTestId("leftController"));

        jest.runAllTimers();

        expect(queryByText(months[currentMonth])).toBeNull();
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        getByText(months[currentMonth]);
    })
});

describe("DatePicker with specified props should", () => {

    it("render specified date", () => {
        const { getByText } = render(<DatePicker initialDate = { new Date(2018,1,5) } />);

        getByText("2018");
        getByText(months[1]);
    });

    it("render specified controllers", () => {
        const { getByText } = render(<DatePicker leftControl = {<Text>ZZ</Text>} rightControl = {<Text>XX</Text>} />);

        getByText("ZZ");
        getByText("XX");
    });

    it("render correct localized date of weeks and month with specified locale", () => {
        const { getByText } = render(<DatePicker locale = "ru" />);

        let russianMonth = helper.getMonthNames('ru');
        let russianDaysOfWeek = helper.getDayNames('ru');

        russianDaysOfWeek.forEach(day => {
            getByText(day);
        });

        getByText(russianMonth[new Date().getMonth()]);
    })
});



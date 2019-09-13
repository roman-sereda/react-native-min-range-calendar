import Days from '../src/Days';
import colors from '../src/colors';
import { Text, View } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

let days = new Days(colors, {});

describe("'Days' should", () => {
    it("", () => {

        const { debug } = render(days.getDay(1, {callback: () => {}}));

    });
});

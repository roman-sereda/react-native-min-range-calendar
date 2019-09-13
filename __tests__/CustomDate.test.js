import CustomDate from '../src/CustomDate';

describe("'CustomDate' should ", () => {

    it("initialize from params or Date object", () => {

        let date = new CustomDate(new Date());

        expect(date.year).toBe(new Date().getFullYear());
        expect(date.month).toBe(new Date().getMonth());
        expect(date.day).toBe(new Date().getDate());

        let params = { year: 2018, month: 1, day: 1 };

        date = new CustomDate(params);

        expect(date.year).toBe(params.year);
        expect(date.month).toBe(params.month);
        expect(date.day).toBe(params.day);
    })

    it("initialize new Date() if no params set", () => {

        let date = new CustomDate(new Date());

        expect(date.year).toBe(new Date().getFullYear());
        expect(date.month).toBe(new Date().getMonth());
        expect(date.day).toBe(new Date().getDate());
    })

    it("avoid wrong params", () => {

        let date = new CustomDate({year: true, month: '123', day: new Date() });

        expect(date.year).toBe(new Date().getFullYear());
        expect(date.month).toBe(new Date().getMonth());
        expect(date.day).toBe(new Date().getDate());
    })

    it("be before greater date", () => {

        let date1 = new CustomDate({ year: 2019, month: 1, day: 1 });

        let check = (date2) => {
            expect(date1.isBefore(date2)).toBe(true);
            expect(date1.isAfter(date2)).toBe(false);

            expect(date1.isBefore(date1)).toBe(false);
            expect(date1.isAfter(date1)).toBe(false);
        };

        check(new CustomDate({ year: 2019, month: 2, day: 1 }));
        check(new CustomDate({ year: 2020, month: 1, day: 1 }));
        check(new CustomDate({ year: 2019, month: 1, day: 2 }));
    })

    it("be equal with the same date", () => {

        let date1 = new CustomDate({ year: 2019, month: 1, day: 1 });
        let date2 = new CustomDate({ year: 2019, month: 1, day: 1 });

        expect(date1.isEqualTo(date2)).toBe(true);
    })

    it("return new increased date after calling 'addDays'", () => {

        let date = new CustomDate({ year: 2019, month: 0, day: 1 });
        let newDate = date.addDays(33);

        expect(newDate.month).toBe(1);
        expect(newDate.day).toBe(3);
    })
});

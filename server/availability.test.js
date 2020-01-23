const { availabilityForIds } = require("./availability");

describe("generating random numbers for ids", () => {
    test("it generates a number in range [0, 1) for each input id", () => {
        const input = ["5", "-2", "300"];
        const output = availabilityForIds(input);
        expect(output.length).toEqual(input.length);
        output.forEach(value => {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        })
    });

    test("it returns an empty array if no ids are provided", () => {
        const input = [];
        const output = availabilityForIds(input);
        expect(output).toEqual([]);
    });
});
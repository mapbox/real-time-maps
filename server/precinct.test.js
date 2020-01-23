const { precinctStatuses } = require("./precinct");
const { hashCode } = require("hashcode");

describe("generating random numbers for precincts", () => {
    test("it generates a number in range [0, 1) for each input id", () => {
        const input = ["O90", "I200", "A505"];
        const output = precinctStatuses(input);
        expect(output.length).toEqual(input.length);
        output.forEach(value => {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        })
    });

    test("it returns an empty array if no ids are provided", () => {
        const input = [];
        const output = precinctStatuses(input);
        expect(output).toEqual([]);
    });
});
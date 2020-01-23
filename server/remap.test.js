const { mix, remap } = require("./remap");

describe("mix", () => {
    it("interpolates between two increasing values", () => {
        const result = mix(0.0, 1.0, 0.5);
        expect(result).toBe(0.5);
    });

    it("interpolates between two decreasing values", () => {
        const result = mix(0.0, -1.0, 0.5);
        expect(result).toBe(-0.5);
    });
})

describe("remap", () => {
    it("changes a normalized range to non-normalized range", () => {
        const result = remap(0.0, 1.0, 0.5, 10, 20);
        expect(result).toBe(15);
    });
    it("changes a non-normalized range to a normalized range", () => {
        const result = remap(10, 20, 15, 0.0, 1.0);
        expect(result).toBe(0.5);
    });
    it("converts between inverted ranges", () => {
        const result = remap(10, 0, 5, -8, -10);
        expect(result).toBe(-9);
    });
});
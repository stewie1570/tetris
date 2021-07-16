import { squareFrom, active, empty, inactive } from './constants'

describe("Square From Type", () => {
    it("Returns the proper square", () => {
        expect(squareFrom({ type: "active" })).toBe(active);
        expect(squareFrom({ type: "inactive" })).toBe(inactive);
        expect(squareFrom({ type: "empty" })).toBe(empty);
    });
});
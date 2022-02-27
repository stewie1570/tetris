import { getDisplayTimeFrom } from './time';

test("80 seconds returns 1:20", () => {
    expect(getDisplayTimeFrom(80)).toBe("1:20");
});

test("25 seconds returns 0:25", () => {
    expect(getDisplayTimeFrom(25)).toBe("0:25");
});

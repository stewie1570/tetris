import { tetrisBoardFrom, stringFrom } from "./serialization";
import { active, empty, inactive } from "../core/constants";

describe("Serialization", () => {
  it("should convert a string to tetris board", () => {
    expect(
      tetrisBoardFrom(`
        --*--
        --**-
        ##---`)
    ).toEqual([
      [empty, empty, active, empty, empty],
      [empty, empty, active, active, empty],
      [inactive, inactive, empty, empty, empty],
    ]);
  });

  it("should convert a tetris board to string", () => {
    expect(
      stringFrom([
        [empty, empty, active, empty, empty],
        [empty, empty, active, active, empty],
        [inactive, inactive, empty, empty, empty],
      ])
    ).toEqual(
      `
        --*--
        --**-
        ##---`.replace(/ /g, "")
    );
  });

  it("should return empty string when serializing non-array", () => {
    expect(stringFrom(null)).toEqual("");
  });
});

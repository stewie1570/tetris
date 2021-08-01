import { tetrisBoardFrom, stringFrom } from "./serialization";
import { activeColumnRangeFrom } from "./board";

describe("Board", () => {
  describe("Active Columns", () => {
    it("is the range of columns that have active squares", () => {
      const board = tetrisBoardFrom(`
                --**--
                --**--
                ------`);

      expect(activeColumnRangeFrom({ board })).toEqual({ x1: 2, x2: 3 });
    });
  });
});

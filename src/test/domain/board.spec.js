import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { activeColumnRangeFrom } from '../../domain/board'

describe("Board", () => {
    describe("Active Columns", () => {
        it("is the range of columns that have active squares", () => {
            var board = tetrisBoard(`
                --**--
                --**--
                ------`);

            expect(activeColumnRangeFrom({ board })).toEqual({ x1: 2, x2: 3 });
        });
    });
});
import { tetrisBoardFrom, stringFrom } from './serialization'
import { iterate, iterateUntilInactive } from './iteration'


describe("Iteration", () => {
    it("iterate should move active squares down", () => {
        var board = tetrisBoardFrom(`
            --**--
            ------`);

        expect(stringFrom(iterate({ board }).board)).toEqual(stringFrom(tetrisBoardFrom(`
            ------
            --**--`)));
    });

    it("iterate should inactive board when active squares are at the bottom", () => {
        var board = tetrisBoardFrom(`
            ------
            --**--`);

        expect(stringFrom(iterate({ board }).board)).toEqual(stringFrom(tetrisBoardFrom(`
            ------
            --##--`)));
    });

    it("iterate should inactive board when active squares can't move down", () => {
        var board = tetrisBoardFrom(`
            ------
            --**--
            ---#--`);

        expect(stringFrom(iterate({ board }).board)).toEqual(stringFrom(tetrisBoardFrom(`
            ------
            --##--
            ---#--`)));
    });

    it("iterate should send a new shape when board is inactive", () => {
        var board = tetrisBoardFrom(`
            ------
            ------
            ------
            --##--
            ---#--`);
        var shapeProvider = () => [
            [true, true],
            [false, true]
        ];

        expect(stringFrom(iterate({ board, shapeProvider }).board)).toEqual(stringFrom(tetrisBoardFrom(`
            **----
            -*----
            ------
            --##--
            ---#--`)));
    });

    describe("Iterate Until Inactive", () => {
        it("iterates the board until the active squares become inactive", () => {
            var board = tetrisBoardFrom(`
                **----
                -*----
                ------
                ---###
                ---#--`);

            expect(stringFrom(iterateUntilInactive({ board }))).toEqual(stringFrom(tetrisBoardFrom(`
                ------
                ------
                ------
                ##-###
                -#-#--`)));
        });
    });

    describe("Full Row", () => {
        it("moves rows above it down and increments the score", () => {
            var board = tetrisBoardFrom(`
                ------
                ---###
                ######
                ######
                ---#--`);
            var shapeProvider = () => [
                [true, true],
                [false, true]
            ];

            var result = iterate({ board, shapeProvider, score: 4 });

            expect(stringFrom(result.board)).toEqual(stringFrom(tetrisBoardFrom(`
                **----
                -*----
                ------
                ---###
                ---#--`)));
            expect(result.score).toBe(6);
        });

        it("moves rows above it down even when the last row is full", () => {
            var board = tetrisBoardFrom(`
                ------
                ---###
                ######`);
            var shapeProvider = () => [
                [true, true],
                [false, true]
            ];

            expect(stringFrom(iterate({ board, shapeProvider }).board)).toEqual(stringFrom(tetrisBoardFrom(`
                **----
                -*----
                ---###`)));
        });
    });

    describe("Game Over", () => {
        it("is false when a new shape can be placed", () => {
            var board = tetrisBoardFrom(`
                ------
                ------
                ------
                --##--
                ---#--`);
            var shapeProvider = () => [
                [true, true],
                [false, true]
            ];

            expect(iterate({ board, shapeProvider }).isOver).toBe(false);
        });

        it("is true when a new shape can't be placed", () => {
            var board = tetrisBoardFrom(`
                ####--
                ---#--`);
            var shapeProvider = () => [
                [true, true],
                [false, true]
            ];

            var result = iterate({ board, shapeProvider });

            expect(result.isOver).toBe(true);
            expect(stringFrom(result.board)).toEqual(stringFrom(tetrisBoardFrom(`
                **##--
                -*-#--`)));
        });
    });
});
import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { iterate, iterateUntilInactive } from '../../domain/game'

describe("Game", () => {
    describe("Iteration", () => {
        it("iterate should move active squares down", () => {
            var board = tetrisBoard(`
                --**--
                ------`);

            expect(stringFrom(iterate({ board }).board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --**--`)));
        });

        it("iterate should inactive board when active squares are at the bottom", () => {
            var board = tetrisBoard(`
                ------
                --**--`);

            expect(stringFrom(iterate({ board }).board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --##--`)));
        });

        it("iterate should inactive board when active squares can't move down", () => {
            var board = tetrisBoard(`
                ------
                --**--
                ---#--`);

            expect(stringFrom(iterate({ board }).board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --##--
                ---#--`)));
        });

        it("iterate should send a new shape when board is inactive", () => {
            var board = tetrisBoard(`
                    ------
                    ------
                    ------
                    --##--
                    ---#--`);
            var shapeProvider = () => [
                [true, true],
                [false, true]
            ];

            expect(stringFrom(iterate({ board, shapeProvider }).board)).toEqual(stringFrom(tetrisBoard(`
                **----
                -*----
                ------
                --##--
                ---#--`)));
        });

        describe("Iterate Until In Active", () => {
            it("iterates the board until the active squares become inactive", () => {
                var board = tetrisBoard(`
                    **----
                    -*----
                    ------
                    ---###
                    ---#--`);

                expect(stringFrom(iterateUntilInactive({ board }).board)).toEqual(stringFrom(tetrisBoard(`
                    ------
                    ------
                    ------
                    ##-###
                    -#-#--`)));
            });
        });

        describe("Full Row", () => {
            it("moves rows above it down and increments the score", () => {
                var board = tetrisBoard(`
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

                expect(stringFrom(result.board)).toEqual(stringFrom(tetrisBoard(`
                    **----
                    -*----
                    ------
                    ---###
                    ---#--`)));
                expect(result.score).toBe(6);
            });

            it("moves rows above it down even when the last row is full", () => {
                var board = tetrisBoard(`
                    ------
                    ---###
                    ######`);
                var shapeProvider = () => [
                    [true, true],
                    [false, true]
                ];

                expect(stringFrom(iterate({ board, shapeProvider }).board)).toEqual(stringFrom(tetrisBoard(`
                    **----
                    -*----
                    ---###`)));
            });
        });

        describe("Game Over", () => {
            it("is false when a new shape can be placed", () => {
                var board = tetrisBoard(`
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
                var board = tetrisBoard(`
                            ####--
                            ---#--`);
                var shapeProvider = () => [
                    [true, true],
                    [false, true]
                ];

                var result = iterate({ board, shapeProvider });

                expect(result.isOver).toBe(true);
                expect(stringFrom(result.board)).toEqual(stringFrom(tetrisBoard(`
                    **##--
                    -*-#--`)));
            });
        });
    });
});
import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { Game } from '../../domain/game'

describe("Game", () => {
    var game = new Game();

    describe("Iteration", () => {
        it("iterate should move active squares down", () => {
            var board = tetrisBoard(`
                --**--
                ------`);

            expect(stringFrom(game.iterate({ board }).board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --**--`)));
        });

        it("iterate should inactive board when active squares are at the bottom", () => {
            var board = tetrisBoard(`
                ------
                --**--`);

            expect(stringFrom(game.iterate({ board }).board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --##--`)));
        });

        it("iterate should inactive board when active squares can't move down", () => {
            var board = tetrisBoard(`
                ------
                --**--
                ---#--`);

            expect(stringFrom(game.iterate({ board }).board)).toEqual(stringFrom(tetrisBoard(`
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

            expect(stringFrom(game.iterate({ board, shapeProvider }).board)).toEqual(stringFrom(tetrisBoard(`
                    **----
                    -*----
                    ------
                    --##--
                    ---#--`)));
        });

        // describe("Full Row", () => {
        //     it("deletes the full row, moves rows above it down and increments the score", () => {
        //         var board = tetrisBoard(`
        //             ------
        //             ---###
        //             ######
        //             ######
        //             ---#--`);
        //         var shapeProvider = () => [
        //             [true, true],
        //             [false, true]
        //         ];

        //         expect(stringFrom(game.iterate({ board, shapeProvider }).board)).toEqual(stringFrom(tetrisBoard(`
        //             **----
        //             -*----
        //             ------
        //             ---###
        //             ---#--`)));
        //     });
        // });

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

                expect(game.iterate({ board, shapeProvider }).isOver).toBe(false);
            });

            it("is true when a new shape can't be placed", () => {
                var board = tetrisBoard(`
                            ####--
                            ---#--`);
                var shapeProvider = () => [
                    [true, true],
                    [false, true]
                ];

                var result = game.iterate({ board, shapeProvider });

                expect(result.isOver).toBe(true);
                expect(stringFrom(result.board)).toEqual(stringFrom(tetrisBoard(`
                    **##--
                    -*-#--`)));
            });
        });
    });
});
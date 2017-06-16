import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { Game } from '../../domain/game'

describe("Game", () => {
    describe("Iteration", () => {
        it("iterate should move active squares down", () => {
            var game = new Game({
                board: tetrisBoard(`
                --**--
                ------`)
            });

            game.iterate();

            expect(stringFrom(game.board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --**--`)));
        });

        it("iterate should inactive board when active squares are at the bottom", () => {
            var game = new Game({
                board: tetrisBoard(`
                ------
                --**--`)
            });

            game.iterate();

            expect(stringFrom(game.board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --##--`)));
        });

        it("iterate should inactive board when active squares can't move down", () => {
            var game = new Game({
                board: tetrisBoard(`
                ------
                --**--
                ---#--`)
            });

            game.iterate();

            expect(stringFrom(game.board)).toEqual(stringFrom(tetrisBoard(`
                ------
                --##--
                ---#--`)));
        });

        it("iterate should send a new shape when board is inactive", () => {
            var game = new Game({
                board: tetrisBoard(`
                    ------
                    ------
                    ------
                    --##--
                    ---#--`),
                shapeProvider: () => [
                    [true, true],
                    [false, true]
                ]
            });

            game.iterate();

            expect(stringFrom(game.board)).toEqual(stringFrom(tetrisBoard(`
                **----
                -*----
                ------
                --##--
                ---#--`)));
        });

        describe("Game Over", () => {
            it("is false when a new shape can be placed", () => {
                var game = new Game({
                    board: tetrisBoard(`
                        ------
                        ------
                        ------
                        --##--
                        ---#--`),
                    shapeProvider: () => [
                        [true, true],
                        [false, true]
                    ]
                });

                game.iterate();

                expect(game.isOver).toBe(false);
            });

            it("is true when a new shape can't be placed", () => {
                var game = new Game({
                    board: tetrisBoard(`
                        ####--
                        ---#--`),
                    shapeProvider: () => [
                        [true, true],
                        [false, true]
                    ]
                });

                game.iterate();

                expect(game.isOver).toBe(true);
                expect(stringFrom(game.board)).toEqual(stringFrom(tetrisBoard(`
                    **##--
                    -*-#--`)));
            });
        });
    });
});
import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { move, rotate } from '../../domain/motion'

describe("Motion", () => {
    describe("Move", () => {
        it("should move active squares", () => {
            expect(stringFrom(move({
                board: tetrisBoard(`
                    --**--
                    --**--
                    ------`),
                to: { y: 1, x: -1 }
            })))
                .toEqual(stringFrom(tetrisBoard(`
                    ------
                    -**---
                    -**---`)));
        });

        it("should not move active squares outside of the board", () => {
            var board = tetrisBoard(`
                ------
                --**--`);
            expect(move({ board, to: { y: 1 } })).toBe(board);
        });

        it("should not move active squares on top of inactive squares", () => {
            var board = tetrisBoard(`
                --**##`);
            expect(move({ board, to: { x: 1 } })).toBe(board);
        });
    });

    describe("Rotate", () => {
        it("should rotate the active horozontal shape to the right to become vertical", () => {
            expect(stringFrom(rotate({
                board: tetrisBoard(`
                ------
                ---*--
                -***--
                ------`)
            })))
                .toEqual(stringFrom(tetrisBoard(`
                ------
                -*----
                -*----
                -**---`)));
        });

        it("should rotate the active vertical shape to the right to become horozontal", () => {
            expect(stringFrom(rotate({
                board: tetrisBoard(`
                ------
                -*----
                -*----
                -**---`)
            })))
                .toEqual(stringFrom(tetrisBoard(`
                ------
                -***--
                -*----
                ------`)));
        });

        it("should rotate the active vertical shape to the right to become horozontal against the wall", () => {
            expect(stringFrom(rotate({
                board: tetrisBoard(`
                ------
                ---*--
                ---*--
                ---**-`)
            })))
                .toEqual(stringFrom(tetrisBoard(`
                ------
                ---***
                ---*--
                ------`)));
        });


        it("can't rotate to vertical on top of inactive squares", () => {
            var board = tetrisBoard(`
                ------
                ---*--
                -***--
                -###--`);
            expect(rotate({ board })).toBe(board);
        });

        it("can't rotate to horizontal on top of inactive squares", () => {
            var board = tetrisBoard(`
                ------
                ---*##
                ---*--
                ---**-`);
            expect(rotate({ board })).toBe(board);
        });

        it("can't rotate on active squares off the board", () => {
            var board = tetrisBoard(`
                ------
                ------
                ---*--
                -***--`);
            expect(rotate({ board })).toBe(board);
        });
    });
});
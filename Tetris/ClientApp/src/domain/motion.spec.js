import { tetrisBoardFrom, stringFrom } from './serialization'
import { move, rotate } from './motion'

describe("Motion", () => {
    describe("Move", () => {
        it("should move active squares verically", () => {
            expect(stringFrom(move({
                board: tetrisBoardFrom(`
                    --**--
                    --**--
                    ------`),
                to: { y: 1 }
            })))
                .toEqual(stringFrom(tetrisBoardFrom(`
                    ------
                    --**--
                    --**--`)));
        });

        it("should move active squares horozontally", () => {
            expect(stringFrom(move({
                board: tetrisBoardFrom(`
                    --**--
                    --**--
                    ------`),
                to: { y: 1, x: -1 }
            })))
                .toEqual(stringFrom(tetrisBoardFrom(`
                    ------
                    -**---
                    -**---`)));
        });

        it("should move active squares both verically and horozontally", () => {
            expect(stringFrom(move({
                board: tetrisBoardFrom(`
                    --**--
                    --**--
                    ------`),
                to: { x: -1 }
            })))
                .toEqual(stringFrom(tetrisBoardFrom(`
                    -**---
                    -**---
                    ------`)));
        });

        it("should not move active squares outside of the board", () => {
            const board = tetrisBoardFrom(`
                ------
                --**--`);
            expect(move({ board, to: { y: 1 } })).toBe(board);
        });

        it("should not move active squares on top of inactive squares", () => {
            const board = tetrisBoardFrom(`
                --**##`);
            expect(move({ board, to: { x: 1 } })).toBe(board);
        });

        it("should not move active squares when x and y are zero", () => {
            const board = tetrisBoardFrom(`
                --**--
                --**--
                ------`);
            expect(move({ board, to: { y: 0, x: 0 } })).toBe(board);
        });
    });

    describe("Rotate", () => {
        it("should rotate the active horozontal shape to the right to become vertical", () => {
            expect(stringFrom(rotate({
                board: tetrisBoardFrom(`
                ------
                ---*--
                -***--
                ------`)
            })))
                .toEqual(stringFrom(tetrisBoardFrom(`
                ------
                -*----
                -*----
                -**---`)));
        });

        it("should rotate the active vertical shape to the right to become horozontal", () => {
            expect(stringFrom(rotate({
                board: tetrisBoardFrom(`
                ------
                -*----
                -*----
                -**---`)
            })))
                .toEqual(stringFrom(tetrisBoardFrom(`
                ------
                -***--
                -*----
                ------`)));
        });

        it("should rotate the active vertical shape to the right to become horozontal against the wall", () => {
            expect(stringFrom(rotate({
                board: tetrisBoardFrom(`
                ------
                ---*--
                ---*--
                ---**-`)
            })))
                .toEqual(stringFrom(tetrisBoardFrom(`
                ------
                ---***
                ---*--
                ------`)));
        });

        it("can't rotate to vertical on top of inactive squares", () => {
            const board = tetrisBoardFrom(`
                ------
                ---*--
                -***--
                -###--`);
            expect(rotate({ board })).toBe(board);
        });

        it("can't rotate to horizontal on top of inactive squares", () => {
            const board = tetrisBoardFrom(`
                ------
                ---*##
                ---*--
                ---**-`);
            expect(rotate({ board })).toBe(board);
        });

        it("can't rotate on active squares off the board", () => {
            const board = tetrisBoardFrom(`
                ------
                ------
                ---*--
                -***--`);
            expect(rotate({ board })).toBe(board);
        });
    });
});
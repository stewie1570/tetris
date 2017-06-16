import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { move, rotate } from '../../domain/motion'

describe("Motion", () => {
    describe("Move", () => {
        it("should move active squares", () => {
            expect(stringFrom(move({
                board: tetrisBoard(`
                    --**--
                    ------`),
                to: { y: 1, x: -2 }
            })))
                .toEqual(stringFrom(tetrisBoard(`
                    ------
                    **----`)));
        });

        it("should not move active squares outside of the board", () => {
            expect(stringFrom(move({
                board: tetrisBoard(`
                    ------
                    --**--`),
                to: { y: 1 }
            })))
                .toEqual(stringFrom(tetrisBoard(`
                    ------
                    --**--`)));
        });

        it("should not move active squares on top of inactive squares", () => {
            expect(stringFrom(move({
                board: tetrisBoard(`
                    --**##`),
                to: { x: 1, }
            })))
                .toEqual(stringFrom(tetrisBoard(`
                    --**##`)));
        });
    });

    describe("Rotate", () => {
        it("rotates the active squares to the right", () => {
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
    });
});
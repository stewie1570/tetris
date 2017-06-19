import { tetrisBoard, stringFrom } from '../../domain/serialization'
import { active, empty, inactive } from '../../core/constants'

describe("Serialization", () => {
    it("should convert a string to tetris board", () => {
        expect(tetrisBoard(`
            --*--
            --**-
            ##---`))
            .toEqual([
                [empty, empty, active, empty, empty],
                [empty, empty, active, active, empty],
                [inactive, inactive, empty, empty, empty]
            ]);
    });

    it("should convert a tetris board to string", () => {
        expect(stringFrom([
            [empty, empty, active, empty, empty],
            [empty, empty, active, active, empty],
            [inactive, inactive, empty, empty, empty]
        ]
        )).toEqual(`
--*--
--**-
##---`);
    });

    it("should return empty string when serializing non-array", () => {
        expect(stringFrom(null)).toEqual("");
    })
})
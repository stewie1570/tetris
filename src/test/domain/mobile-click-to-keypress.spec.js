import { keys } from '../../core/constants'
import { clickToKeyPress, isControl } from '../../domain/mobile-click-to-keypress'

describe("Mobile Mouse Click", () => {
    describe("(x, y) to key press translation", () => {
        it("should invoke space bar for bottom 3rd of screen", () => {
            window.innerHeight = 100;
            var keyClicked = null;

            expect(clickToKeyPress({ y: 67 })).toEqual(keys.space);
        });

        it("should invoke up arrow for top 3rd of screen", () => {
            window.innerHeight = 100;
            var keyClicked = null;

            expect(clickToKeyPress({ y: 32 })).toEqual(keys.up);
        });

        it("should invoke left arrow for middle 3rd / left half of screen", () => {
            window.innerHeight = 100;
            window.innerWidth = 100;
            var keyClicked = null;

            expect(clickToKeyPress({ y: 50, x: 49 })).toEqual(keys.left);
        });

        it("should invoke right arrow for middle 3rd / right half of screen", () => {
            window.innerHeight = 100;
            window.innerWidth = 100;
            var keyClicked = null;

            expect(clickToKeyPress({ y: 50, x: 60 })).toEqual(keys.right);
        });
    });

    describe("control click detection", () => {
        it("should return true when click target is an input", () => {
            expect(isControl({ target: { nodeName: "INPUT" } })).toEqual(true);
            expect(isControl({ target: { nodeName: "input" } })).toEqual(true);
            expect(isControl({ target: { nodeName: "Input" } })).toEqual(true);
        });

        it("should return true when click target is an button", () => {
            expect(isControl({ target: { nodeName: "BUTTON" } })).toEqual(true);
            expect(isControl({ target: { nodeName: "button" } })).toEqual(true);
            expect(isControl({ target: { nodeName: "Button" } })).toEqual(true);
        });

        it("should return true when click target is an select", () => {
            expect(isControl({ target: { nodeName: "SELECT" } })).toEqual(true);
            expect(isControl({ target: { nodeName: "select" } })).toEqual(true);
            expect(isControl({ target: { nodeName: "Select" } })).toEqual(true);
        });

        it("should return false when click target is not a control", () => {
            expect(isControl({ target: { nodeName: "center" } })).toEqual(false);
            expect(isControl({ target: { nodeName: "div" } })).toEqual(false);
            expect(isControl({ target: { nodeName: "p" } })).toEqual(false);
            expect(isControl({ target: {} })).toEqual(false);
        });
    });
});
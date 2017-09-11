import { keys } from '../core/constants'

export function clickToKeyPress({ y, x }) {
    var height = window.innerHeight;
    var width = window.innerWidth;

    return y >= 0.6666 * height ? keys.space
        : y < 0.3333 * height ? keys.up
        : x < 0.5 * width ? keys.left
        : keys.right;
}

export function isControl({ target }) {
    var nodeName = ((target && target.nodeName) || "").toLowerCase();
    
    return [
        "select",
        "button",
        "input"
    ].some(controlNodeName => controlNodeName === nodeName);
}
export const empty = { type: "empty" };
export const active = { type: "active" };
export const inactive = { type: "inactive" };

export const squareFrom = ({type}) => type === "active" ? active
    : type === "inactive" ? inactive
    : empty;

export const keys = {
    left: 37,
    right: 39,
    down: 40,
    up: 38,
    space: 32
};

export const loading = "loading";
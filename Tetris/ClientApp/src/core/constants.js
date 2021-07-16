export var empty = { type: "empty" };
export var active = { type: "active" };
export var inactive = { type: "inactive" };

export var squareFrom = ({type}) => type === "active" ? active
    : type === "inactive" ? inactive
    : empty;

export var keys = {
    left: 37,
    right: 39,
    down: 40,
    up: 38,
    space: 32
};

export var loading = "loading";
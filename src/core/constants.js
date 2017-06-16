export var empty = { type: "empty" };
export var active = { type: "active" };
export var inactive = { type: "inactive" };

export var squareFrom = ({type}) => type === "active" ? active
    : type === "inactive" ? inactive
    : empty;
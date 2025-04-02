import React, { forwardRef } from "react";
import { useLoadingState } from "leaf-validator";
import { withTemporaryDisable } from "./HOCs/withTemporaryDisable";

const DefaultCommandButton = forwardRef(
  ({ onClick, runningText, type, children, ...otherProps }, ref) => {
    const [isRunning, showRunningWhile] = useLoadingState();

    const click = async (source) => {
      (await onClick) && !isRunning && showRunningWhile(onClick(source));
    };

    return (
      <button
        style={{ width: "90%" }}
        {...otherProps}
        ref={ref}
        onClick={click}
        type={type || "button"}
      >
        {isRunning && runningText ? runningText : children}
      </button>
    );
  }
);

export const CommandButton = withTemporaryDisable(DefaultCommandButton);

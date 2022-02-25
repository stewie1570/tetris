import React, { forwardRef } from 'react';
import { useLoadingState } from 'leaf-validator'

export const CommandButton = forwardRef(({ onClick, runningText, disabled, type, children, ...otherProps }, ref) => {
    const [isRunning, showRunningWhile] = useLoadingState();

    const click = async source => {
        await onClick && !isRunning && showRunningWhile(onClick(source))
    }

    return <button
        style={{ width: "90%" }}
        {...otherProps}
        ref={ref}
        onClick={click}
        disabled={disabled || isRunning}
        type={type || "button"}>
        {isRunning && runningText ? runningText : children}
    </button>;
});
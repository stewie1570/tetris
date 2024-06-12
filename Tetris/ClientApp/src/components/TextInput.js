import React, { useRef } from 'react';
import { useLifeCycle } from '../hooks/useLifeCycle';

export const TextInput = ({ value, onChange, autofocus, ...otherProps }) => {
    const inputRef = useRef();
    const update = (event) => onChange?.(event.target.value);

    useLifeCycle({
        onMount: () => autofocus && inputRef.current?.focus()
    });

    return <input
        autoComplete='off'
        {...otherProps}
        type="text"
        value={value}
        ref={inputRef}
        onChange={update} />;
}
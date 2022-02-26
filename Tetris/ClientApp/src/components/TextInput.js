import React, { useEffect, useRef } from 'react';

export const TextInput = ({ value, onChange, autofocus, ...otherProps }) => {
    const inputRef = useRef();
    const update = (event) => onChange?.(event.target.value);

    useEffect(() => {
        autofocus && inputRef.current?.focus();
    }, []);

    return <input
        style={{ width: '90%' }}
        {...otherProps}
        type="text"
        value={value}
        ref={inputRef}
        onChange={update} />;
}
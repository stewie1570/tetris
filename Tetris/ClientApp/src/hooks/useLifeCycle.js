import { useEffect, useRef } from 'react';

export const useLifeCycle = ({ onMount, onUnMount }) => {
    const lifeCycleFunctions = useRef({ onMount, onUnMount });
    lifeCycleFunctions.current = { onMount, onUnMount };

    useEffect(() => {
        lifeCycleFunctions.current?.onMount?.();

        return lifeCycleFunctions.current?.onUnMount;
    }, []);
}
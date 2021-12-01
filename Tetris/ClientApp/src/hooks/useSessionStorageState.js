import { useEffect, useMemo } from 'react'
import { useMountedOnlyState as useState } from 'leaf-validator'

function getSessionStateFor(storageKey) {
    const storageValue = window.sessionStorage.getItem(storageKey);
    return storageValue ? JSON.parse(storageValue) : undefined;
}

export function useSessionStorageState(storageKey) {
    const initialState = useMemo(() => getSessionStateFor(storageKey), [storageKey]);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        function loadStorageIntoState() {
            setState(getSessionStateFor(storageKey));
        }

        window.addEventListener('storage', loadStorageIntoState);

        return () => {
            window.removeEventListener('storage', loadStorageIntoState);
        }
    }, [storageKey]);

    function setStorageState(valueOrSetter) {
        setState(valueOrSetter instanceof Function
            ? state => updateStorageValue(valueOrSetter(state))
            : updateStorageValue(valueOrSetter));

        function updateStorageValue(value) {
            window.sessionStorage.setItem(storageKey, JSON.stringify(value));
            return value;
        }
    }

    return [state, setStorageState];
}
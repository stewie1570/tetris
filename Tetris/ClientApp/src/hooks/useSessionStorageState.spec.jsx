import React, { useEffect, useRef, useState } from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { useSessionStorageState } from './useSessionStorageState';
import { flushSync } from 'react-dom';
import { act } from 'react-dom/test-utils';

let storage = {};
let getterCallCount = 0;
beforeEach(() => {
    getterCallCount = 0;
    Storage.prototype.setItem = (key, value) => storage[key] = value;
    Storage.prototype.getItem = key => {
        getterCallCount++;
        return storage[key];
    }
});
afterEach(() => { storage = {}; });

function SetStateViaValue() {
    const [state, setState] = useSessionStorageState("StorageKey");

    return <div>
        {state || "no state"}
        <button onClick={() => flushSync(() => setState("expected value"))}>Set State</button>
    </div>
}

function SetStateViaCallback() {
    const [state, setState] = useSessionStorageState("StorageKey");
    const callCount = useRef(0);

    return <div>
        {state || "no state"}
        <button onClick={() => flushSync(() => setState(state => `value: ${JSON.stringify(state)}`))}>Set State</button>
    </div>
}

function Hide({ children }) {
    const [hidden, setHidden] = useState(true);

    return <>
        {hidden
            ? <button onClick={() => flushSync(setHidden(false))}>Show</button>
            : children}
    </>;
}

beforeEach(() => {
    window.localStorage.clear();
});

test("has value ready for initial effect", () => {
    storage["StorageKey"] = '"expected value"';
    const TestApp = () => {
        const [state, setState] = useSessionStorageState("StorageKey");
        const [count, setCount] = useState(1);

        useEffect(() => {
            !state && setState("updated value");
        }, []);

        return <>
            <div>{state || "no state"}</div>
            <div>
                <button onClick={() => flushSync(() => setCount(count + 1))}>Increment</button>
                Count: {count}
            </div>
        </>;
    };

    render(<TestApp />);
    act(() => {
        screen.getByText("expected value");
        screen.getByText("Count: 1");
        screen.getByText("Increment").click();
        screen.getByText("Count: 2");
        screen.getByText("Increment").click();
        screen.getByText("Count: 3");
        screen.getByText("Increment").click();
        screen.getByText("Count: 4");
    });
    expect(getterCallCount).toBe(1);
})

test("can update state via value", () => {
    render(<SetStateViaValue />);

    screen.getByText("no state");
    act(() => {
        screen.getByText("Set State").click();
    });
    screen.getByText("expected value");
});

test("can update state via callback", () => {
    render(<SetStateViaCallback />);

    screen.getByText("no state");
    act(() => {
        screen.getByText("Set State").click();
    });
    screen.getByText("value: undefined");
});

test("shows proper initial state when session storage key is defined", async () => {
    render(<>
        <SetStateViaValue />
        <Hide>
            <SetStateViaValue />
        </Hide>
    </>);

    expect(screen.getAllByText("no state").length).toBe(1);
    act(() => {
        screen.getByText("Set State").click();
        screen.getByText("Show").click();
    });
    await waitFor(() => {
        expect(screen.getAllByText("expected value").length).toBe(2);
    });
});
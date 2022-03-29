import React from 'react';
import { flushSync } from 'react-dom';
import { render, screen } from "@testing-library/react";
import { useAsyncEffect } from './useAsyncEffect';
import { act } from 'react-dom/test-utils';

const TestApp = ({ effectCallback }) => {
    const [count, setCount] = React.useState(0);

    useAsyncEffect(effectCallback, [count]);

    return (
        <>
            Count: {count}
            <button onClick={() => flushSync(() => setCount(count => count + 1))}>
                Invoke Effect
            </button>
        </>
    );
}

test("invoked effects", async () => {
    const effectCallback = jest.fn();
    render(<TestApp effectCallback={effectCallback} />);
    expect(effectCallback).toHaveBeenCalledTimes(1);
    act(() => {
        screen.getByText("Invoke Effect").click();
    });
    await screen.findByText("Count: 1");
    expect(effectCallback).toHaveBeenCalledTimes(1);
});

test("only runs effect action when action is not already in-flight", async () => {
    let resolver;
    const effectAction = new Promise(resolve => {
        resolver = resolve;
    });
    const effectCallback = jest.fn(() => effectAction);
    render(<TestApp effectCallback={effectCallback} />);
    expect(effectCallback).toHaveBeenCalledTimes(1);
    act(() => {
        new Array(20).fill(0).forEach(() => {
            screen.getByText("Invoke Effect").click();
        });
    });
    resolver();
    await screen.findByText("Count: 20");
    act(() => {
        screen.getByText("Invoke Effect").click();
    });
    await screen.findByText("Count: 21");
    expect(effectCallback).toHaveBeenCalledTimes(2);
});
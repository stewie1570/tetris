import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { useAsyncEffect } from './useAsyncEffect';

const TestApp = ({ effectCallback }) => {
    const [count, setCount] = React.useState(0);

    useAsyncEffect(effectCallback, [count]);

    return (
        <>
            Count: {count}
            <button onClick={() => setCount(count => count + 1)}>
                Invoke Effect
            </button>
        </>
    );
}

test("invoked effects", async () => {
    const effectCallback = jest.fn();
    render(<TestApp effectCallback={effectCallback} />);
    expect(effectCallback).toHaveBeenCalledTimes(1);
    screen.getByText("Invoke Effect").click();
    await screen.findByText("Count: 1");
    expect(effectCallback).toHaveBeenCalledTimes(2);
});

test("only runs effect action when action is not already in-flight", async () => {
    let resolver;
    const effectAction = new Promise(resolve => {
        resolver = resolve;
    });
    const effectCallback = jest.fn(() => effectAction);
    render(<TestApp effectCallback={effectCallback} />);
    expect(effectCallback).toHaveBeenCalledTimes(1);
    new Array(20).fill(0).forEach(() => {
        screen.getByText("Invoke Effect").click();
    });
    resolver();
    await screen.findByText("Count: 20");
    screen.getByText("Invoke Effect").click();
    await screen.findByText("Count: 21");
    expect(effectCallback).toHaveBeenCalledTimes(3);
});
import React from 'react';
import { flushSync } from 'react-dom';
import { render, screen } from "@testing-library/react";
import { useAsyncEffect } from './useAsyncEffect';
import { act } from 'react-dom/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

describe('useAsyncEffect', () => {
    it('invoked effects', async () => {
        const effectCallback = vi.fn().mockResolvedValue();
        render(<TestApp effectCallback={effectCallback} />);
        expect(effectCallback).toHaveBeenCalledTimes(1);
    });

    it('only runs effect action when action is not already in-flight', async () => {
        let resolveFirst;
        const firstPromise = new Promise(resolve => { resolveFirst = resolve; });
        const effectCallback = vi.fn()
            .mockImplementationOnce(() => firstPromise)
            .mockResolvedValue();

        render(<TestApp effectCallback={effectCallback} />);
        expect(effectCallback).toHaveBeenCalledTimes(1);

        screen.getByText('Invoke Effect').click();
        expect(effectCallback).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveFirst();
            await firstPromise;
        });

        screen.getByText('Invoke Effect').click();
        expect(effectCallback).toHaveBeenCalledTimes(2);
    });
});
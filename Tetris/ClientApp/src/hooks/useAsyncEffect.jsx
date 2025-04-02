import React from 'react';

export const useAsyncEffect = (action, deps) => {
    const isRunning = React.useRef(false);

    React.useEffect(() => {
        (async () => {
            if (!isRunning.current) {
                try {
                    isRunning.current = true;
                    await action();
                }
                finally {
                    isRunning.current = false;
                }
            }
        })();
    }, [...deps]);
};

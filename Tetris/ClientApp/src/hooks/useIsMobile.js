import { useState } from 'react';
import { useLifeCycle } from './useLifeCycle';

const threshold = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < threshold);
    const handleResize = () => setIsMobile(window.innerWidth < threshold);

    useLifeCycle({
        onMount: () => window.addEventListener('resize', handleResize),
        onUnMount: () => window.removeEventListener('resize', handleResize)
    })

    return isMobile;
}
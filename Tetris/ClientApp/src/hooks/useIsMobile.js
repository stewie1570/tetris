import { useState } from 'react';
import { useLifeCycle } from './useLifeCycle';

const threshold = 768;
const mobileUserAgentPattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function isMobileCheck() {
    const userAgent = navigator.userAgent;
    const isMobileUserAgent = mobileUserAgentPattern.test(userAgent);
    const isMobileResolution = window.innerWidth < threshold;

    return isMobileResolution || isMobileUserAgent;
}

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(isMobileCheck());
    const handleResize = () => setIsMobile(isMobileCheck());

    useLifeCycle({
        onMount: () => window.addEventListener('resize', handleResize),
        onUnMount: () => window.removeEventListener('resize', handleResize)
    });

    return isMobile;
}
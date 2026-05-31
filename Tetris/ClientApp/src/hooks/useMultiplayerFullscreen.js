import { useEffect } from "react";

export const useMultiplayerFullscreen = ({ containerRef, enabled, active }) => {
  useEffect(() => {
    const container = containerRef.current;

    if (!enabled || !active) {
      if (document.fullscreenElement === container) {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }

    if (container && document.fullscreenElement !== container) {
      container.requestFullscreen?.().catch(() => {});
    }
  }, [containerRef, enabled, active]);
};

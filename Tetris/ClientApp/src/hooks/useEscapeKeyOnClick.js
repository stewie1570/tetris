import { useLifeCycle } from "./useLifeCycle";

export const useEscapeKeyOnClick = ({ onEscapeKeyClick }) => {
    const onEscape = (event) => event.key === "Escape" && onEscapeKeyClick();

    useLifeCycle({
        onMount: () => window.addEventListener("keydown", onEscape),
        onUnMount: () => window.removeEventListener("keydown", onEscape)
    });
}
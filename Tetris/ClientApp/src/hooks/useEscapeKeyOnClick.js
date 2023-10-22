import { useEffect } from "react"

export const useEscapeKeyOnClick = ({ onEscapeKeyClick }) => {
    useEffect(() => {
        const onEscape = (event) => event.key === "Escape" && onEscapeKeyClick();

        window.addEventListener("keydown", onEscape);

        return () => window.removeEventListener("keydown", onEscape);
    });
}
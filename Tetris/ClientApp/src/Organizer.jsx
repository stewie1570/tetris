import React from "react";
import { useResultsSender } from "./hooks/useResultsSender";
import { usePlayerListSender } from "./hooks/usePlayerListSender";

export const Organizer = ({ children }) => {
    usePlayerListSender();
    useResultsSender();

    return <>{children}</>;
};

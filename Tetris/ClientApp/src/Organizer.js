import React from "react";
import { useResultsSenderWith } from "./hooks/useResultsSenderWith";
import { usePlayerListSenderWith } from "./hooks/usePlayerListSenderWith";

export const Organizer = ({ children, otherPlayers }) => {
    usePlayerListSenderWith({ otherPlayers });
    useResultsSenderWith({ otherPlayers });

    return <>{children}</>;
};

import React, { useContext } from "react";
import { useResultsSenderWith } from "./hooks/useResultsSenderWith";
import { usePlayerListSenderWith } from "./hooks/usePlayerListSenderWith";
import { MultiplayerContext } from "./MultiplayerContext";

export const Organizer = ({ children }) => {
    const { otherPlayers } = useContext(MultiplayerContext);

    usePlayerListSenderWith({ otherPlayers });
    useResultsSenderWith({ otherPlayers });

    return <>{children}</>;
};

import { useContext } from "react";
import { useParams } from "react-router-dom";
import { MultiplayerContext } from "../MultiplayerContext";

export const useOrganizerId = () => {
    const { organizerUserId } = useParams();
    const { userId } = useContext(MultiplayerContext);

    return organizerUserId.toLowerCase() === "host" ? userId : organizerUserId;
}
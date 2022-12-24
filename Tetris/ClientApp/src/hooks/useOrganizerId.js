import { useParams } from "react-router-dom";
import { useMultiplayerContext } from "../MultiplayerContext";

export const useOrganizerId = () => {
    const { organizerUserId } = useParams();
    const { userId } = useMultiplayerContext();

    return organizerUserId.toLowerCase() === "host" ? userId : organizerUserId;
}
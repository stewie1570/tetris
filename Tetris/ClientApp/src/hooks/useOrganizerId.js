import { useParams } from "react-router";
import { useMultiplayerContext } from "../MultiplayerContext";

export const useOrganizerId = () => {
    const { organizerUserId } = useParams();
    const { userId } = useMultiplayerContext();

    return organizerUserId.toLowerCase() === "host" ? userId : organizerUserId;
}
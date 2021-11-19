import React, { useEffect } from "react";
import { useParams } from "react-router";

export const MultiplayerGame = ({ gameHub, isConnected }) => {
    const [otherPlayers, setOtherPlayers] = React.useState({});
    const { organizerUserId } = useParams();

    useEffect(() => {
        isConnected && setReceiveHandlers();
        isConnected && gameHub.send.hello({ userId: "user1", groupId: organizerUserId });

        function setReceiveHandlers() {
            return gameHub.receive.setHandlers({
                hello: ({ userId }) => {
                    setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: {} }));
                },
                status: ({ userId, ...updatedUser }) => {
                    setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: updatedUser }));
                },
            });
        }
    }, [gameHub, isConnected]);

    return <>
        Players:
        {
            Object
                .keys(otherPlayers)
                .map(userId => <div key={userId}>
                    {otherPlayers[userId].name ?? "[Un-named player]"}
                </div>)
        }
    </>;
}
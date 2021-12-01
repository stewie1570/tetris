import React, { useEffect } from "react";
import { useParams } from "react-router";

export const MultiplayerGame = ({ gameHub, isConnected, userId: currentUserId }) => {
    const [otherPlayers, setOtherPlayers] = React.useState({});
    const { organizerUserId } = useParams();

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && setReceiveHandlers();
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId
            }
        });

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
    }, [gameHub, isConnected, currentUserId]);

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
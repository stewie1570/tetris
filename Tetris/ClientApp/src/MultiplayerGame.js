import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { update } from "./domain/players";
import { GameHubContext } from "./SignalRGameHubContext";

export const MultiplayerGame = () => {
    const [otherPlayers, setOtherPlayers] = React.useState({});
    const { organizerUserId } = useParams();
    const { gameHub, isConnected, userId: currentUserId } = useContext(GameHubContext);

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        const processReceivedHello = ({ userId }) => {
            setOtherPlayers(otherPlayers => {
                const updatedPlayers = { ...otherPlayers, [userId]: {} };
                gameHub.send.playersListUpdate({
                    groupId: organizerUserId,
                    message: {
                        players: [currentUserId, ...Object.keys(updatedPlayers)]
                    }
                });
                return updatedPlayers;
            });
        };

        function setReceiveHandlers() {
            return gameHub.receive.setHandlers({
                hello: processReceivedHello,
                playersListUpdate: ({ players: updatedPlayersList }) => {
                    setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
                },
                status: ({ userId, ...updatedUser }) => {
                    setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: updatedUser }));
                },
            });
        }

        isConnectedWithUserId && setReceiveHandlers();
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId
            }
        });
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
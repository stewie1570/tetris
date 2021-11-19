import React from "react";
import {
    render,
    screen,
    act,
    waitFor
} from "@testing-library/react";
import { MultiplayerGame } from "./MultiplayerGame";

const createTestGameHub = () => {
    const context = {
        handlers: null,
        sentMessages: []
    };
    const gameHub = {
        send: {
            hello: (userId) => { context.sentMessages.push({ hello: userId }) },
            status: status => { context.sentMessages.push({ status }) },
            start: () => { context.sentMessages.push({ start: null }) },
            gameOver: () => { context.sentMessages.push({ gameOver: null }) },
            result: (result) => { context.sentMessages.push({ result }) },
            noOrganizer: () => { context.sentMessages.push({ noOrganizer: null }) }
        },
        receive: {
            setHandlers: givenHandlers => { context.handlers = givenHandlers; }
        }
    }

    return { context, gameHub };
};

test("hosting a multiplayer game", async () => {
    const testGameHub = createTestGameHub();
    render(<MultiplayerGame gameHub={testGameHub.gameHub} isConnected />);

    act(() => {
        testGameHub.context.handlers.hello({ userId: "user1" });
    });
    await screen.findByText("[Un-named player]");

    act(() => {
        testGameHub.context.handlers.status({ userId: "user1", name: "Stewart" });
    });
    await screen.findByText("Stewart");
});

test("joining and playing a multiplayer game", async () => {
    const testGameHub = createTestGameHub();
    render(<MultiplayerGame gameHub={testGameHub.gameHub} isConnected />);

    await waitFor(() => {
        expect(testGameHub.context.sentMessages).toEqual([
            { hello: { userId: "user1" } }
        ]);
    })
});
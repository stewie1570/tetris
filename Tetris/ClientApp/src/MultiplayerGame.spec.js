import React from "react";
import {
    render,
    screen,
    act,
    waitFor
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "./App";
import { GameHubContext } from "./SignalRGameHubContext";

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

function renderWith(testGameHub) {
    render(<MemoryRouter initialEntries={["/group1"]}>
        <GameHubContext.Provider value={{ gameHub: testGameHub.gameHub, isConnected: true }}>
            <App />
        </GameHubContext.Provider>
    </MemoryRouter>);
}

test("hosting a multiplayer game", async () => {
    const testGameHub = createTestGameHub();
    renderWith(testGameHub);

    act(() => testGameHub.context.handlers.hello({ userId: "user1" }));
    await screen.findByText("[Un-named player]");

    act(() => testGameHub.context.handlers.status({ userId: "user1", name: "Stewart" }));
    await screen.findByText("Stewart");
});

test("joining a multiplayer game", async () => {
    const testGameHub = createTestGameHub();
    renderWith(testGameHub);

    await waitFor(() => {
        expect(testGameHub.context.sentMessages).toEqual([
            { hello: { groupId: "group1", message: { userId: "user1" } } }
        ]);
    })
});

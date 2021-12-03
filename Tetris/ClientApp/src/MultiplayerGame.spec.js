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
            playersListUpdate: (playersList) => { context.sentMessages.push({ playersListUpdate: playersList }) },
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

function renderWith({ gameHub, route, userIdGenerator }) {
    render(<MemoryRouter initialEntries={[route ?? "/group1"]}>
        <GameHubContext.Provider value={{ gameHub, isConnected: true }}>
            <App userIdGenerator={userIdGenerator} />
        </GameHubContext.Provider>
    </MemoryRouter>);
}

beforeEach(() => {
    window.sessionStorage.clear();
});

test("Organizer: hosting a multiplayer game", async () => {
    const { gameHub, context } = createTestGameHub();
    renderWith({ gameHub, route: "/organizer", userIdGenerator: () => "organizer" });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "organizer", message: { userId: "organizer" } } }
        ]);
    });

    act(() => context.handlers.hello({ userId: "user1" }));
    await screen.findByText("[Un-named player]");
    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "organizer", message: { userId: "organizer" } } },
            { playersListUpdate: { groupId: "organizer", message: { players: ["organizer", "user1"] } } }
        ]);
    });

    act(() => context.handlers.status({ userId: "user1", name: "Stewart" }));
    await screen.findByText("Stewart");
});

test("Player: joining a multiplayer game", async () => {
    const { gameHub, context } = createTestGameHub();
    renderWith({ gameHub, userIdGenerator: () => "user1" });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "group1", message: { userId: "user1" } } }
        ]);
    })
});

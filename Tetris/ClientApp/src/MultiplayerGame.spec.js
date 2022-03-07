import React, { useEffect } from "react";
import {
    render,
    screen,
    act,
    waitFor,
    within,
    fireEvent,
    waitForElementToBeRemoved
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "./App";
import { MultiplayerContext } from "./MultiplayerContext";
import { stringFrom } from "./domain/serialization";
import { emptyBoard } from "./components/TetrisGame";
import { initialEmptyPlayersList, selectableDurations } from './constants';
import { useMountedOnlyState } from "leaf-validator";

const signals = [
    "hello",
    "playersListUpdate",
    "status",
    "start",
    "gameOver",
    "results",
    "disconnect",
    "noOranizer",
    "reset"
];

const createTestGameHub = () => {
    const context = {
        handlers: null,
        sentMessages: []
    };
    const signalHandlers = signals.reduce((acc, signal) => ({
        ...acc,
        [signal]: obj => {
            context.sentMessages.push({ [signal]: obj });
            return new Promise(resolve => setTimeout(resolve, 100));
        }
    }), {});
    const gameHub = {
        send: { ...signalHandlers },
        invoke: { ...signalHandlers },
        receive: {
            setHandlers: givenHandlers => { context.handlers = givenHandlers; }
        }
    }

    return { context, gameHub };
};

const MultiplayerTestContext = ({ children, gameHub, userIdGenerator }) => {
    const [isConnected, setIsConnected] = React.useState(false);
    const [gameEndTime, setGameEndTime] = React.useState(null);
    const [organizerConnectionStatus, setOrganizerConnectionStatus] = React.useState(false);
    const [otherPlayers, setOtherPlayers] = useMountedOnlyState(initialEmptyPlayersList);
    const [gameResults, setGameResults] = React.useState(null);
    const [selectedDuration, setSelectedDuration] = React.useState(selectableDurations[0] * 1000);

    useEffect(() => {
        setTimeout(() => setIsConnected(true), 100);
    }, []);

    const timeProvider = () => 1000;

    return (
        <MultiplayerContext.Provider value={{
            gameHub,
            isConnected,
            userId: userIdGenerator(),
            timeProvider,
            gameEndTime,
            setGameEndTime,
            organizerConnectionStatus,
            setOrganizerConnectionStatus,
            otherPlayers,
            setOtherPlayers,
            gameResults,
            setGameResults,
            selectedDuration,
            setSelectedDuration
        }}>
            {children}
        </MultiplayerContext.Provider>
    );
};

function renderWith({ gameHub, route, userIdGenerator }) {
    render(<MemoryRouter initialEntries={[route ?? "/group1"]}>
        <MultiplayerTestContext gameHub={gameHub} userIdGenerator={userIdGenerator}>
            <App />
        </MultiplayerTestContext>
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
            { hello: { groupId: "organizer", message: { userId: "organizer" } } },
            {
                "playersListUpdate": {
                    "groupId": "organizer",
                    "message": {
                        "players": [
                            {
                                "name": undefined,
                                "userId": "organizer",
                            },
                        ],
                    },
                },
            },
        ]);
    });

    act(() => context.handlers.hello({ userId: "user1" }));
    expect(await screen.findAllByText("[Un-named player]")).toHaveLength(2);

    act(() => context.handlers.status({ userId: "user1", name: "user one" }));
    await screen.findByText("user one");

    act(() => context.handlers.hello({ userId: "user2" }));
    expect(await screen.findAllByText("[Un-named player]")).toHaveLength(2);

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "organizer", message: { userId: "organizer" } } },
            {
                playersListUpdate: {
                    groupId: "organizer",
                    message: {
                        players: [
                            { userId: "organizer" }
                        ]
                    }
                }
            },
            {
                playersListUpdate: {
                    groupId: "organizer",
                    message: {
                        players: [
                            { userId: "organizer" },
                            { userId: "user1" }
                        ]
                    }
                }
            },
            {
                playersListUpdate: {
                    groupId: "organizer",
                    message: {
                        players: [
                            { userId: "organizer" },
                            { userId: "user1", name: "user one" },
                            { userId: "user2" }
                        ]
                    }
                }
            }
        ]);
    });

    act(() => context.handlers.status({ userId: "user1", name: "Stewart" }));
    await screen.findByText("Stewart");
});

test("Organizer: setting user name", async () => {
    const { gameHub, context } = createTestGameHub();
    renderWith({ gameHub, route: "/organizer", userIdGenerator: () => "organizer" });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            {
                "hello": {
                    "groupId": "organizer",
                    "message": {
                        "name": undefined,
                        "userId": "organizer",
                    },
                },
            },
            {
                "playersListUpdate": {
                    "groupId": "organizer",
                    "message": {
                        "players": [
                            {
                                "name": undefined,
                                "userId": "organizer",
                            },
                        ],
                    },
                },
            },
        ]);
    });

    screen.getByText("Set User Name").click();
    const userNameTextInput = await within(
        await screen.findByRole("dialog")
    ).findByLabelText(/What user name would you like/);
    fireEvent.change(userNameTextInput, {
        target: { value: " Stewie  " },
    });
    screen.getByText(/Ok/).click();

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            {
                "hello": {
                    "groupId": "organizer",
                    "message": {
                        "name": undefined,
                        "userId": "organizer",
                    },
                },
            },
            {
                "playersListUpdate": {
                    "groupId": "organizer",
                    "message": {
                        "players": [
                            {
                                "name": undefined,
                                "userId": "organizer",
                            },
                        ],
                    },
                },
            },
            { status: { groupId: "organizer", message: { userId: "organizer", name: "Stewie" } } }
        ]);
    });
});

test("Organizer: starting a game", async () => {
    const { gameHub, context } = createTestGameHub();
    renderWith({ gameHub, route: "/organizer", userIdGenerator: () => "organizer" });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            {
                "hello": {
                    "groupId": "organizer",
                    "message": {
                        "name": undefined,
                        "userId": "organizer",
                    },
                },
            },
            {
                "playersListUpdate": {
                    "groupId": "organizer",
                    "message": {
                        "players": [
                            {
                                "name": undefined,
                                "userId": "organizer",
                            },
                        ],
                    },
                },
            },
        ]);
    });

    screen.getByText("Set User Name").click();
    const userNameTextInput = await within(
        await screen.findByRole("dialog")
    ).findByLabelText(/What user name would you like/);
    fireEvent.change(userNameTextInput, {
        target: { value: " Stewie  " },
    });
    screen.getByText(/Ok/).click();
    await waitForElementToBeRemoved(() => screen.getByText(/What user name would you like/));
    act(() => context.handlers.start());
    act(() => {
        window.dispatchEvent(new CustomEvent("iterate-game"));
    });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "organizer", message: { userId: "organizer" } } },
            {
                "playersListUpdate": {
                    "groupId": "organizer",
                    "message": {
                        "players": [
                            {
                                "name": undefined,
                                "userId": "organizer",
                            },
                        ],
                    },
                },
            },
            { status: { groupId: "organizer", message: { userId: "organizer", name: "Stewie" } } },
            {
                status: {
                    groupId: "organizer",
                    message: {
                        userId: "organizer",
                        name: "Stewie",
                        board: stringFrom(emptyBoard), score: 0,
                        timeLeft: 60000
                    }
                }
            }
        ]);
    });
});

test("Player: joining a multiplayer game", async () => {
    const { gameHub, context } = createTestGameHub();
    renderWith({ gameHub, userIdGenerator: () => "user1" });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "group1", message: { userId: "user1" } } }
        ]);
    });

    act(() => context.handlers.playersListUpdate({
        players: [
            { userId: 'organizer', name: "The Organizer" },
            { userId: 'user1', name: "Player One" }
        ]
    }));
    await screen.findByText("The Organizer");
    await screen.findByText("Player One");
});

test("Player: starting a multiplayer game", async () => {
    const { gameHub, context } = createTestGameHub();
    renderWith({ gameHub, userIdGenerator: () => "user1" });

    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "group1", message: { userId: "user1" } } }
        ]);
    });
    act(() => context.handlers.playersListUpdate({
        players: [
            { userId: 'organizer', name: "The Organizer" },
            { userId: 'user1', name: "Player One" }
        ]
    }));

    screen.getByText("Start Game").click();
    await waitFor(() => {
        expect(context.sentMessages).toEqual([
            { hello: { groupId: "group1", message: { userId: "user1" } } },
            { start: { groupId: "group1" } }
        ]);
    });

    act(() => context.handlers.start());
    await screen.findByText("Score: 0");
});
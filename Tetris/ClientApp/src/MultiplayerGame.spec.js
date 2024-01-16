import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  within,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "./App";
import { MultiplayerContext } from "./MultiplayerContext";
import { initialEmptyPlayersList, selectableDurations } from "./constants";
import { set, useMountedOnlyState } from "leaf-validator";
import { useLifeCycle } from "./hooks/useLifeCycle";

const signals = [
  'hello',
  'playersListUpdate',
  'status',
  'start',
  'gameOver',
  'results',
  'disconnect',
  'noOranizer',
  'reset',
  'sendChat',
  'setChatLines'
];

const createTestGameHub = () => {
  const context = {
    handlers: null,
    sentMessages: [],
  };
  const signalHandlers = signals.reduce(
    (acc, signal) => ({
      ...acc,
      [signal]: (obj) => {
        context.sentMessages.push({ [signal]: obj });
        return new Promise((resolve) => setTimeout(resolve, 100));
      },
    }),
    {}
  );
  const gameHub = {
    send: { ...signalHandlers },
    invoke: { ...signalHandlers },
    receive: {
      setHandlers: (givenHandlers) => {
        context.handlers = givenHandlers;
      },
    },
  };

  return { context, gameHub };
};

const MultiplayerTestContext = ({ children, gameHub, userIdGenerator }) => {
  const [isConnected, setIsConnected] = React.useState();
  const [gameEndTime, setGameEndTime] = React.useState(null);
  const [organizerConnectionStatus, setOrganizerConnectionStatus] =
    React.useState(false);
  const [otherPlayers, setOtherPlayers] = useMountedOnlyState(
    initialEmptyPlayersList
  );
  const [gameResults, setGameResults] = React.useState(null);
  const [selectedDuration, setSelectedDuration] = React.useState(
    selectableDurations[0] * 1000
  );
  const [canGuestStartGame, setCanGuestStartGame] = React.useState(false);

  useLifeCycle({
    onMount: () => setTimeout(() => setIsConnected(true), 1000)
  })

  const timeProvider = () => 1000;

  return (
    <MultiplayerContext.Provider
      value={{
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
        setSelectedDuration,
        canGuestStartGame,
        setCanGuestStartGame,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

function renderWith({ gameHub, route, userIdGenerator }) {
  render(
    <MemoryRouter initialEntries={[route ?? "/group1"]}>
      <MultiplayerTestContext
        gameHub={gameHub}
        userIdGenerator={userIdGenerator}
      >
        <App />
      </MultiplayerTestContext>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
});

test("Organizer: hosting a multiplayer game", async () => {
  const { gameHub, context } = createTestGameHub();
  renderWith({ gameHub, route: "/host", userIdGenerator: () => "host" });

  await waitFor(
    () => {
      const filteredSentMessages = set("0.hello.message.isRunning")
        .to(undefined)
        .in(context.sentMessages);
      expect(filteredSentMessages).toEqual([
        {
          hello: {
            groupId: "host",
            message: { userId: "host" },
          },
        },
        {
          playersListUpdate: {
            groupId: "host",
            message: {
              players: [
                {
                  name: undefined,
                  userId: "host",
                  disconnected: false
                },
              ],
              isStartable: true,
            },
          },
        },
      ]);
    },
    { timeout: 10000 }
  );

  act(() => context.handlers.hello({ userId: "user1" }));
  expect(await screen.findAllByText("[Un-named player]")).toHaveLength(2);

  act(() => context.handlers.status({ userId: "user1", name: "user one" }));
  await screen.findByText("user one");

  act(() => context.handlers.hello({ userId: "user2" }));
  expect(await screen.findAllByText("[Un-named player]")).toHaveLength(2);

  await waitFor(() => {
    const filteredSentMessages = set("0.hello.message.isRunning")
      .to(undefined)
      .in(context.sentMessages);
    expect(filteredSentMessages).toEqual([
      {
        hello: {
          groupId: "host",
          message: { userId: "host" },
        },
      },
      {
        playersListUpdate: {
          groupId: "host",
          message: {
            players: [{ userId: "host", disconnected: false }],
            isStartable: true,
          },
        },
      },
      {
        setChatLines: {
          "groupId": "host"
        }
      },
      {
        playersListUpdate: {
          groupId: "host",
          message: {
            players: [{ userId: "host", disconnected: false }, { userId: "user1", disconnected: false }],
            isStartable: true,
          },
        },
      },
      {
        setChatLines: {
          "groupId": "host"
        }
      },
      {
        playersListUpdate: {
          groupId: "host",
          message: {
            players: [
              { userId: "host", disconnected: false },
              { userId: "user1", name: "user one", disconnected: false },
              { userId: "user2", disconnected: false },
            ],
            isStartable: true,
          },
        },
      },
    ]);
  });

  act(() => context.handlers.status({ userId: "user1", name: "Stewart" }));
  await screen.findByText("Stewart");
}, 30000);

test("Organizer: setting user name", async () => {
  const { gameHub, context } = createTestGameHub();
  renderWith({ gameHub, route: "/host", userIdGenerator: () => "host" });

  await waitFor(
    () => {
      expect(context.sentMessages).toEqual([
        {
          hello: {
            groupId: "host",
            message: {
              name: undefined,
              userId: "host",
              isRunning: false,
            },
          },
        },
        {
          playersListUpdate: {
            groupId: "host",
            message: {
              players: [
                {
                  name: undefined,
                  userId: "host",
                  disconnected: false
                },
              ],
              isStartable: true,
            },
          },
        },
      ]);
    },
    { timeout: 5000 }
  );

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
        hello: {
          groupId: "host",
          message: {
            name: undefined,
            userId: "host",
            isRunning: false,
          },
        },
      },
      {
        playersListUpdate: {
          groupId: "host",
          message: {
            players: [
              {
                name: undefined,
                userId: "host",
                disconnected: false
              },
            ],
            isStartable: true,
          },
        },
      },
      {
        status: {
          groupId: "host",
          message: { userId: "host", name: "Stewie" },
        },
      },
    ]);
  });
}, 10000);

test("Player: joining a multiplayer game", async () => {
  const { gameHub, context } = createTestGameHub();
  renderWith({ gameHub, userIdGenerator: () => "user1" });

  await waitFor(
    () => {
      expect(context.sentMessages).toEqual([
        {
          hello: {
            groupId: "group1",
            message: { userId: "user1", isRunning: false },
          },
        },
      ]);
    },
    { timeout: 5000 }
  );
  act(() =>
    context.handlers.playersListUpdate({
      players: [{ userId: "host", name: "The Organizer" }, { userId: "user1" }],
    })
  );
  await screen.findByText("The Organizer");
  await screen.findByText("[Un-named player]");

  act(() =>
    context.handlers.playersListUpdate({
      players: [
        { userId: "host", name: "The Organizer" },
        { userId: "user1", name: "-Player One-" },
      ],
    })
  );
  await screen.findByText("The Organizer");
  await waitFor(() => {
    within(screen.getByText("Players:")).getByText("-Player One-");
  });
}, 10000);

test("Player: starting a multiplayer game", async () => {
  const { gameHub, context } = createTestGameHub();
  renderWith({ gameHub, userIdGenerator: () => "user1" });

  await waitFor(
    () => {
      expect(context.sentMessages).toEqual([
        {
          hello: {
            groupId: "group1",
            message: { userId: "user1", isRunning: false },
          },
        },
      ]);
    },
    { timeout: 5000 }
  );

  act(() =>
    context.handlers.playersListUpdate({
      players: [
        { userId: "host", name: "The Organizer" },
        { userId: "user1", name: "Player One" },
      ],
      isStartable: true,
    })
  );

  screen.getByText("Start Game").click();
  await waitFor(() => {
    expect(context.sentMessages).toEqual([
      {
        hello: {
          groupId: "group1",
          message: { userId: "user1", isRunning: false },
        },
      },
      { start: { groupId: "group1" } },
    ]);
  });

  act(() => context.handlers.start());
  await screen.findByText("Score: 0");
}, 10000);

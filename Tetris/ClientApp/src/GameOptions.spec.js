import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GameOptions } from "./GameOptions";
import { MultiplayerContext } from "./MultiplayerContext";

const renderWithContext = (contextValue) =>
  render(
    <MultiplayerContext.Provider value={contextValue}>
      <GameOptions />
    </MultiplayerContext.Provider>
  );

test("shows full-screen option and toggles preference", () => {
  const setFullscreenEnabled = jest.fn();

  renderWithContext({
    fullscreenEnabled: false,
    setFullscreenEnabled,
  });

  expect(screen.getByText("Options")).toBeInTheDocument();
  const checkbox = screen.getByLabelText("Full-screen game play");
  expect(checkbox).not.toBeChecked();

  fireEvent.click(checkbox);
  expect(setFullscreenEnabled).toHaveBeenCalledWith(true);
});

test("reflects enabled full-screen preference", () => {
  renderWithContext({
    fullscreenEnabled: true,
    setFullscreenEnabled: jest.fn(),
  });

  expect(screen.getByLabelText("Full-screen game play")).toBeChecked();
});

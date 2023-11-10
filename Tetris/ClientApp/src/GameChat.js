import React, { useState } from "react";
import { useMultiplayerContext } from "./MultiplayerContext";
import { TextInput } from "./components/TextInput";
import { CommandButton } from "./components/CommandButton";
import styled from "styled-components";
import { useOrganizerId } from "./hooks/useOrganizerId";

const SendButton = styled(CommandButton)`
  white-space: nowrap;
  margin-left: 1rem;
`;

export function GameChat() {
  const [messageText, setMessageText] = useState("");
  const organizerId = useOrganizerId();
  const { chatLines, gameHub, userId, otherPlayers } = useMultiplayerContext();
  const userHasName = !!otherPlayers[userId]?.name;

  const sendMessage = async (event) => {
    event?.preventDefault();

    const isMessageEmpty = !messageText || messageText === "";
    const canChat = !isMessageEmpty && userHasName;

    !userHasName &&
      window.dispatchEvent(
        new CustomEvent("user-error", {
          detail: "You must set a name before sending messages.",
        })
      );

    try {
      canChat &&
        (await gameHub.invoke.sendChat({
          groupId: organizerId,
          message: { text: messageText, userId },
        })
          .then(() => setMessageText("")));
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("user-error", {
          detail: error?.message ?? "Unknown error.",
        })
      );
    }
  };

  function nameFrom(chatLine) {
    return otherPlayers[chatLine.userId]?.name;
  }

  function hasNameOrNotification(chatLine) {
    return chatLine.notification || nameFrom(chatLine);
  }

  return (
    <div className="card" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <div className="card-header">Chat</div>
      <div className="card-body">
        <div className="chat-history">
          {chatLines?.filter(hasNameOrNotification).map((chatLine, index) => (
            <div key={index} className="chat-message">
              <strong>{nameFrom(chatLine)}</strong>
              {chatLine.text ? (
                `: ${chatLine.text}`
              ) : (
                <strong>{chatLine.notification}</strong>
              )}
            </div>
          ))}
        </div>
        <form>
          <div className="input-group mb-3 pt-1">
            <TextInput
              className="form-control"
              value={messageText}
              onChange={setMessageText}
            />
            <div>
              <SendButton
                className="btn btn-primary"
                onClick={sendMessage}
                runningText="Sending..."
                type="submit"
              >
                Send
              </SendButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

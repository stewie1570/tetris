import React, { useState } from "react";
import { useMultiplayerContext } from "./MultiplayerContext";
import { TextInput } from "./components/TextInput";
import { CommandButton } from "./components/CommandButton";
import styled from "styled-components";
import { useOrganizerId } from "./hooks/useOrganizerId";
import { useLocalPlayerGameContext } from "./LocalPlayerGame";
import { StringInput } from "./components/Prompt";

const SendButton = styled(CommandButton)`
  white-space: nowrap;
  margin-left: 1rem;
`;

const ChatMessage = styled.div`
  text-align: left;
`;

export function GameChat(props) {
  const [messageText, setMessageText] = useState("");
  const organizerId = useOrganizerId();
  const { chatLines, gameHub, userId, otherPlayers, userId: currentUserId } = useMultiplayerContext();
  const { prompt, setUsername } = useLocalPlayerGameContext();
  const userHasName = !!otherPlayers[userId]?.name;

  const promptUserNameAnd = (action) =>
    prompt((exitModal) => (
      <StringInput
        filter={(value) => (value ?? "").trim()}
        onSubmitString={async (name) => {
          name
            ? await gameHub.invoke
              .status({
                groupId: organizerId,
                message: {
                  userId: currentUserId,
                  name,
                },
              })
              .then(() => setUsername(name))
              .then(action)
              .then(exitModal)
              .catch(({ message }) =>
                window.dispatchEvent(
                  new CustomEvent("user-error", {
                    detail: trimHubExceptionMessage(message),
                  })
                )
              )
            : exitModal();
        }}
        submittingText="Sending..."
      >
        <p>You must have a user name before you send a message.</p>
        <p>What user name would you like?</p>
      </StringInput>
    ));

  const sendMessage = (event) => {
    event?.preventDefault();

    const isMessageEmpty = !messageText || messageText === "";
    if (isMessageEmpty) return;

    const sendTheChat = () => gameHub
      .invoke
      .sendChat({
        groupId: organizerId,
        message: { text: messageText, userId },
      })
      .then(() => setMessageText(""))

    try {
      if (userHasName) {
        return sendTheChat();
      }
      else {
        promptUserNameAnd(sendTheChat);
      }
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
    <div
      style={{ marginTop: "1rem", marginBottom: "1rem" }}
      {...props}
      className={`card ${props?.className ?? ""}`}
    >
      <div className="card-header">Chat</div>
      <div className="card-body">
        <div>
          {chatLines?.filter(hasNameOrNotification).map((chatLine, index) => (
            <ChatMessage key={index}>
              <strong>{nameFrom(chatLine)}</strong>
              {chatLine.text ? (
                `: ${chatLine.text}`
              ) : (
                <strong>{chatLine.notification}</strong>
              )}
            </ChatMessage>
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

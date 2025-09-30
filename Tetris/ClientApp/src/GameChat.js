import React, { useState } from "react";
import { useMultiplayerContext } from "./MultiplayerContext";
import { TextInput } from "./components/TextInput";
import { CommandButton } from "./components/CommandButton";
import styled from "styled-components";
import { useOrganizerId } from "./hooks/useOrganizerId";
import { useLocalPlayerGameContext } from "./LocalPlayerGame";
import { StringInput } from "./components/Prompt";
import { Spinner } from "./components/AnimatedIcons";


const ChatCard = styled.div`
  text-align: left;
`;

const SoundToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    margin: 0;
    vertical-align: middle;
  }

  label {
    margin: 0;
    line-height: 1;
  }
`;

const StyledTextInput = styled(TextInput)`
  display: inherit;
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--color-text-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  border-color: var(--color-link);

  &:focus {
    background: var(--color-input-bg-focus);
    border-color: var(--color-link);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }

  @media (prefers-color-scheme: dark) {
    color: #ffffff !important;
    font-weight: 600;
    -webkit-text-fill-color: #ffffff !important;
  }
`;

export function GameChat(props) {
  const [messageText, setMessageText] = useState("");
  const organizerId = useOrganizerId();
  const { chatLines, gameHub, userId, otherPlayers, userId: currentUserId, soundEnabled, setSoundEnabled } = useMultiplayerContext();
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
        submittingText={<><Spinner /> Sending...</>}
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
    return otherPlayers[chatLine.userId]?.name ?? "Un-named player";
  }

  function hasNameOrNotification(chatLine) {
    return chatLine.notification || nameFrom(chatLine);
  }

  return (
    <ChatCard
      style={{ marginTop: "1rem", marginBottom: "1rem" }}
      {...props}
      className={`card ${props?.className ?? ""}`}
    >
      <div className="card-header d-flex justify-content-between align-items-center" style={{ color: 'var(--color-text-primary)' }}>
        <span>Chat</span>
        <SoundToggle>
          <label htmlFor="sound-toggle" style={{ color: 'var(--color-text-primary)' }}>Sound</label>
          <input
            type="checkbox"
            id="sound-toggle"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
        </SoundToggle>
      </div>
      <div className="card-body">
        <div style={{ color: 'var(--color-text-primary)' }}>
          {chatLines?.filter(hasNameOrNotification).map((chatLine, index) => (
            <div key={index}>
              {chatLine.text ? (
                <><strong>{nameFrom(chatLine)}</strong>: {chatLine.text}</>
              ) : (
                <strong>[{nameFrom(chatLine)} {chatLine.notification}]</strong>
              )}
            </div>
          ))}
        </div>
        <form>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '1rem',
            paddingTop: '0.5rem'
          }}>
            <StyledTextInput
              value={messageText}
              onChange={setMessageText}
              placeholder="Type your message..."
              style={{ 
                flex: 1,
                height: '48px',
                minWidth: '200px'
              }}
            />
            <CommandButton
              onClick={sendMessage}
              runningText={<><Spinner /> Sending...</>}
              type="submit"
              className="btn btn-primary"
              style={{
                height: '48px',
                minWidth: '80px',
                padding: '12px 20px',
                width: 'auto',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Send
            </CommandButton>
          </div>
        </form>
      </div>
    </ChatCard>
  );
}

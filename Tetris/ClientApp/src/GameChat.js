import React, { useState } from "react";
import { useMultiplayerContext } from "./MultiplayerContext";
import { TextInput } from "./components/TextInput";
import { CommandButton } from "./components/CommandButton";
import styled from "styled-components";
import { useOrganizerId } from "./hooks/useOrganizerId";
import { useLocalPlayerGameContext } from "./LocalPlayerGame";
import { StringInput } from "./components/Prompt";
import { Spinner } from "./components/AnimatedIcons";

const SendButton = styled(CommandButton)`
  white-space: nowrap !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 12px 20px !important;
  font-weight: 600 !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
  flex-shrink: 0 !important;
  min-width: 80px !important;
  height: 48px !important;
  width: auto !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
  }
  
  &:active {
    transform: translateY(0) !important;
  }
`;

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
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  color: #2d3748 !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  height: 48px !important;
  min-width: 200px !important;
  width: auto !important;
  flex: 1 !important;

  &:focus {
    background: rgba(255, 255, 255, 0.3) !important;
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    outline: none !important;
  }

  &::placeholder {
    color: rgba(45, 55, 72, 0.6) !important;
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
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Chat</span>
        <SoundToggle>
          <label htmlFor="sound-toggle">Sound</label>
          <input
            type="checkbox"
            id="sound-toggle"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
        </SoundToggle>
      </div>
      <div className="card-body">
        <div>
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
            <SendButton
              onClick={sendMessage}
              runningText={<><Spinner /> Sending...</>}
              type="submit"
              style={{
                height: '48px',
                minWidth: '80px',
                padding: '12px 20px'
              }}
            >
              Send
            </SendButton>
          </div>
        </form>
      </div>
    </ChatCard>
  );
}

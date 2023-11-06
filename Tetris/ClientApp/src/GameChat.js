import React, { useState } from 'react';
import { useMultiplayerContext } from './MultiplayerContext';
import { TextInput } from './components/TextInput';
import { CommandButton } from './components/CommandButton';
import styled from 'styled-components';
import { useOrganizerId } from './hooks/useOrganizerId';

const SendButton = styled(CommandButton)`
    white-space: nowrap;
    margin-left: 1rem;
`;

export function GameChat() {
    const [message, setMessage] = useState('');
    const organizerId = useOrganizerId();
    const { chatLines, gameHub } = useMultiplayerContext();

    const sendMessage = async (event) => {
        event?.preventDefault();
        await gameHub.invoke.sendChat({ groupId: organizerId, message: message });
        setMessage("");
    };

    return (
        <div className="card">
            <div className="card-header">Chat</div>
            <div className="card-body">
                <div className="chat-history">
                    {chatLines.map((line, index) => (
                        <div key={index} className="chat-message">
                            <strong>{line.name}</strong>
                            {line.text}
                        </div>
                    ))}
                </div>
                <form>
                    <div className="input-group mb-3">
                        <TextInput
                            className="form-control"
                            value={message}
                            onChange={setMessage}
                        />
                        <div >
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
};

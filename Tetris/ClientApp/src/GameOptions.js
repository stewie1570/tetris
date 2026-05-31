import React from "react";
import styled from "styled-components";
import { useMultiplayerContext } from "./MultiplayerContext";

const OptionsCard = styled.div`
  text-align: left;
`;

const OptionToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    margin: 0;
    vertical-align: middle;
    accent-color: #667eea;
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  label {
    margin: 0;
    line-height: 1;
    cursor: pointer;
    color: var(--color-text-primary);
  }
`;

export function GameOptions(props) {
  const { fullscreenEnabled, setFullscreenEnabled } = useMultiplayerContext();

  return (
    <OptionsCard
      style={{ marginTop: "1rem", marginBottom: "1rem" }}
      {...props}
      className={`card ${props?.className ?? ""}`}
    >
      <div
        className="card-header"
        style={{ color: "var(--color-text-primary)" }}
      >
        Options
      </div>
      <div className="card-body">
        <OptionToggle>
          <input
            type="checkbox"
            id="fullscreen-toggle"
            checked={fullscreenEnabled}
            onChange={(e) => setFullscreenEnabled(e.target.checked)}
          />
          <label htmlFor="fullscreen-toggle">Full-screen game play</label>
        </OptionToggle>
      </div>
    </OptionsCard>
  );
}

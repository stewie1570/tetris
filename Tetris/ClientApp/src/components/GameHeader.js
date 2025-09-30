import React from "react";
import styled from "styled-components";
import { getDisplayTimeFrom } from "../domain/time";
import { selectableDurations } from "../constants";

const GameDurationSelect = styled.select`
  width: 90%;
`;

const BoldRed = styled.span`
  font-weight: bold;
  color: #dc2626;
  
  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
  }
`;

export const GameHeader = ({ 
  isOrganizer, 
  gamePaused, 
  selectedDuration, 
  onDurationChange, 
  gameEndTime, 
  timeLeft 
}) => {
  return (
    <>
      {isOrganizer && gamePaused && (
        <>
          <label htmlFor="duration">Duration:</label>
          <GameDurationSelect
            name="duration"
            className="form-control"
            value={selectedDuration}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
          >
            {selectableDurations.map((duration) => (
              <option key={duration} value={duration * 1000}>
                {getDisplayTimeFrom(duration)}
              </option>
            ))}
          </GameDurationSelect>
        </>
      )}

      {gameEndTime && (
        <BoldRed>
          Game ends in {getDisplayTimeFrom(Math.floor(timeLeft / 1000))}{" "}
          seconds.
        </BoldRed>
      )}
    </>
  );
};

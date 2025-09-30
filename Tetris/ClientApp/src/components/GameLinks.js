import React from "react";
import { Link } from "react-router-dom";
import { withTemporaryDisable } from "./HOCs/withTemporaryDisable";
import { ContentSwapWhenDisabled } from "./ContentSwapWhenDisabled";

const SwappableLink = (props) => {
  return (
    <ContentSwapWhenDisabled
      disabled={props.disabled}
      disabledContent={
        <p style={props.style} className={props.className}>
          {props.children}
        </p>
      }
    >
      <Link {...props} />
    </ContentSwapWhenDisabled>
  );
};

const InitiallyDisabledLink = withTemporaryDisable(SwappableLink);

const linkStyles = {
  display: "block",
  color: "var(--color-text-primary)",
  fontWeight: "700",
  textDecoration: "none",
  padding: "12px 24px",
  background: "var(--color-card-bg-hover)",
  borderRadius: "12px",
  border: "1px solid var(--color-card-border)",
  backdropFilter: "blur(20px)",
  transition: "all 0.3s ease",
  margin: "1rem auto",
  textAlign: "center",
  width: "90%",
  boxShadow: "0 4px 16px var(--color-card-shadow)"
};

const handleMouseEnter = (e) => {
  e.target.style.background = "var(--color-button-cancel-bg-hover)";
  e.target.style.transform = "translateY(-2px)";
  e.target.style.boxShadow = "0 8px 32px var(--color-card-shadow-hover)";
  e.target.style.color = "var(--color-text-primary)";
};

const handleMouseLeave = (e) => {
  e.target.style.background = "var(--color-card-bg-hover)";
  e.target.style.transform = "translateY(0)";
  e.target.style.boxShadow = "0 4px 16px var(--color-card-shadow)";
  e.target.style.color = "var(--color-text-primary)";
};

export const SinglePlayerGameLink = ({ onGameStart }) => (
  <Link
    style={linkStyles}
    onClick={onGameStart}
    to="/"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    Single Player Game
  </Link>
);

export const InitiallyDisabledPlayerGameLink = ({ onGameStart }) => (
  <InitiallyDisabledLink
    style={linkStyles}
    onClick={onGameStart}
    to="/"
    disableForMilliseconds={1500}
  >
    Single Player Game
  </InitiallyDisabledLink>
);

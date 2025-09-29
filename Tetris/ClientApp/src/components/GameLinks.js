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
  color: "#2d3748",
  fontWeight: "700",
  textDecoration: "none",
  padding: "12px 24px",
  background: "rgba(255, 255, 255, 0.25)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(20px)",
  transition: "all 0.3s ease",
  margin: "1rem auto",
  textAlign: "center",
  width: "90%",
  boxShadow: "0 4px 16px rgba(31, 38, 135, 0.2)"
};

const handleMouseEnter = (e) => {
  e.target.style.background = "rgba(255, 255, 255, 0.35)";
  e.target.style.transform = "translateY(-2px)";
  e.target.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.4)";
  e.target.style.color = "#1a202c";
};

const handleMouseLeave = (e) => {
  e.target.style.background = "rgba(255, 255, 255, 0.25)";
  e.target.style.transform = "translateY(0)";
  e.target.style.boxShadow = "0 4px 16px rgba(31, 38, 135, 0.2)";
  e.target.style.color = "#2d3748";
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

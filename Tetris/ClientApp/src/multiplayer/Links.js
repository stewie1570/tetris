import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ContentSwapWhenDisabled } from "../components/ContentSwapWhenDisabled";
import { withTemporaryDisable } from "../components/HOCs/withTemporaryDisable";

const GameDurationSelect = styled.select`
  width: 90%;
`;

/*
  SwappableLink wraps react-router Link to show a different (non-link)
  presentation while disabled, preserving the look-and-feel used previously.
*/
export const SwappableLink = (props) => {
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

export const InitiallyDisabledLink = withTemporaryDisable(SwappableLink);

export { GameDurationSelect };
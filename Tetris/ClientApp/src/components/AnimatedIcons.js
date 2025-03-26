import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const moveRightAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(0.2rem);
  }
`;

const moveLeftAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-0.2rem);
  }
`;

const moveDownAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(0.2rem);
  }
`;

const explosionAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

export const MovingRight = styled(FontAwesomeIcon)`
  animation: ${moveRightAnimation} 2s none infinite;
`;

export const MovingLeft = styled(FontAwesomeIcon)`
  animation: ${moveLeftAnimation} 2s none infinite;
`;

export const MovingDown = styled(FontAwesomeIcon)`
  animation: ${moveDownAnimation} 2s none infinite;
`;

export const RotatingIcon = styled(FontAwesomeIcon)`
  animation: ${rotateAnimation} 2s linear infinite;
`;

export const Exploding = styled.div`
  animation: ${explosionAnimation} 0.5s ease-out forwards;
`;

export const Spinner = () => <RotatingIcon icon={faRotate} />
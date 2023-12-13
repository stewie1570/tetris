import styled from "styled-components";

export const Header = styled.h1`
  text-align: center;
  color: black;
`;

export const Centered = styled.div`
  text-align: center;
`;

export const Warning = styled.div`
  position: fixed;
  top: 1rem;
  width: 100%;
  text-align: center;
  color: red;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.7);
  width: auto;
  left: 50%;
  transform: translateX(-50%);
`;

export const CenterScreen = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

import styled from "styled-components";

const HeaderOne = styled.h1`
  text-align: center;
  color: black;
`;

export const Header = ({ children, className, ...args }) => (
  <div className={`card mt-3 mb-3 ${className}`} {...args}>
    <div className="card-body">
      <HeaderOne>{children}</HeaderOne>
    </div>
  </div>
);

export const Centered = styled.div`
  text-align: center;
`;

const Well = ({ className, ...props }) => (
  <div className={`card ${className}`} {...props} />
);

export const FixedPositionWarningNotification = styled(Well)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  text-align: center;
  color: red;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  transform: translateX(-50%);
`;

export const CenterScreen = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

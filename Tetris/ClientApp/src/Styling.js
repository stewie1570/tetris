import styled from "styled-components";

const HeaderOne = styled.h1`
  text-align: center;
  color: var(--color-text-primary);
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  color: #e53e3e;
  font-weight: 600;
  background: rgba(229, 62, 62, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 62, 62, 0.3);
  padding: 1rem;
  transform: translateX(-50%);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(229, 62, 62, 0.3);
  
  @media (prefers-color-scheme: dark) {
    background: rgba(248, 113, 113, 0.2);
    border: 1px solid rgba(248, 113, 113, 0.4);
  }
`;

export const CenterScreen = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

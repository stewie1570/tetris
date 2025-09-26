import React, { forwardRef } from "react";
import { useLoadingState } from "leaf-validator";
import { withTemporaryDisable } from "./HOCs/withTemporaryDisable";
import styled from 'styled-components';

const StyledCommandButton = styled.button`
  width: ${props => props.style?.width || '90%'};
  
  /* Apply modern styling only for btn-primary and btn-success, not btn-link */
  ${props => !props.className?.includes('btn-link') && `
    background: ${props.className?.includes('btn-success') 
      ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    } !important;
    border: none !important;
    border-radius: 12px !important;
    padding: ${props.style?.padding || '12px 24px'} !important;
    font-weight: 600 !important;
    color: white !important;
    box-shadow: ${props.className?.includes('btn-success') 
      ? '0 4px 16px rgba(72, 187, 120, 0.3)'
      : '0 4px 16px rgba(102, 126, 234, 0.3)'
    } !important;
    transition: all 0.3s ease !important;
    outline: none !important;
    white-space: ${props.style?.whiteSpace || 'normal'} !important;
    flex-shrink: ${props.style?.flexShrink || '1'} !important;
    min-width: ${props.style?.minWidth || 'auto'} !important;
    height: ${props.style?.height || 'auto'} !important;
  `}
  
  /* Hover effects only for non-link buttons */
  ${props => !props.className?.includes('btn-link') && `
    &:hover {
      transform: translateY(-2px) !important;
      box-shadow: ${props.className?.includes('btn-success') 
        ? '0 6px 20px rgba(72, 187, 120, 0.4)'
        : '0 6px 20px rgba(102, 126, 234, 0.4)'
      } !important;
    }
    
    &:active {
      transform: translateY(0) !important;
    }

    &:focus {
      box-shadow: ${props.className?.includes('btn-success') 
        ? '0 0 0 3px rgba(72, 187, 120, 0.5)'
        : '0 0 0 3px rgba(102, 126, 234, 0.5)'
      } !important;
    }
  `}
`;

const DefaultCommandButton = forwardRef(
  ({ onClick, runningText, type, children, ...otherProps }, ref) => {
    const [isRunning, showRunningWhile] = useLoadingState();

    const click = async (source) => {
      (await onClick) && !isRunning && showRunningWhile(onClick(source));
    };

    return (
      <StyledCommandButton
        {...otherProps}
        ref={ref}
        onClick={click}
        type={type || "button"}
      >
        {isRunning && runningText ? runningText : children}
      </StyledCommandButton>
    );
  }
);

export const CommandButton = withTemporaryDisable(DefaultCommandButton);

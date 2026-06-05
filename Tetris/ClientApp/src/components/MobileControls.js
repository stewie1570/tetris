import { keys } from '../core/constants'
import React from 'react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowDown, faPause, faRotate } from '@fortawesome/free-solid-svg-icons';

const ControlButton = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    color: white;
    font-size: 1.2rem;
    text-shadow: 0 0 4px rgba(0, 0, 0, 1),
                 0 0 8px rgba(0, 0, 0, 1),
                 0 0 12px rgba(0, 0, 0, 1),
                 0 2px 16px rgba(0, 0, 0, 1);
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 1));
    
    &:active {
        opacity: 0.6;
    }
`;

const compactControlHeight = '40%';

const LeftButton = styled(ControlButton)`
    left: 0px;
    font-size: 2rem;
    ${({ $compact }) => $compact
        ? `bottom: 0; width: 25%; height: ${compactControlHeight};`
        : 'top: 0px; width: 50%; height: 100%;'}
`;

const RightButton = styled(ControlButton)`
    right: 0px;
    font-size: 2rem;
    ${({ $compact }) => $compact
        ? `bottom: 0; width: 25%; height: ${compactControlHeight};`
        : 'top: 0px; width: 50%; height: 100%;'}
`;

const TopButton = styled(ControlButton)`
    font-size: 1.5rem;
    ${({ $compact }) => $compact
        ? 'left: 25%; bottom: 28%; width: 50%; height: 12%;'
        : 'left: 15%; top: 0px; width: 70%; height: 15%;'}
`;

const TopStackedButton = styled(ControlButton)`
    font-size: 1.1rem;
    ${({ $compact }) => $compact
        ? 'left: 25%; bottom: 28%; width: 50%; height: 12%;'
        : 'left: 15%; top: 15%; width: 70%; height: 15%;'}
`;

const BottomStackedButton = styled(ControlButton)`
    font-size: 2rem;
    ${({ $compact }) => $compact
        ? 'left: 25%; bottom: 14%; width: 50%; height: 14%;'
        : 'left: 15%; bottom: 15%; width: 70%; height: 15%;'}
`;

const BottomButton = styled(ControlButton)`
    font-size: 1.2rem;
    ${({ $compact }) => $compact
        ? 'left: 25%; bottom: 0; width: 50%; height: 14%;'
        : 'left: 15%; bottom: 0px; width: 70%; height: 15%;'}
`;

export function MobileControls({ compact, onClick, onPause }) {
    return <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <LeftButton $compact={compact} style={{ pointerEvents: "auto" }} onMouseDown={() => onClick && onClick(keys.left)}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </LeftButton>
        <RightButton $compact={compact} style={{ pointerEvents: "auto" }} onMouseDown={() => onClick && onClick(keys.right)}>
            <FontAwesomeIcon icon={faArrowRight} />
        </RightButton>
        <TopButton $compact={compact} style={{ pointerEvents: "auto" }} onMouseDown={() => onClick && onClick(keys.up)}>
            <FontAwesomeIcon icon={faRotate} />
        </TopButton>
        {onPause && <TopStackedButton $compact={compact} style={{ pointerEvents: "auto" }} onMouseDown={onPause}>
            <FontAwesomeIcon icon={faPause} />
            &nbsp;
            <b>Pause</b>
        </TopStackedButton>}
        <BottomStackedButton $compact={compact} style={{ pointerEvents: "auto" }} onMouseDown={() => onClick && onClick(keys.down)}>
            <FontAwesomeIcon icon={faArrowDown} />
        </BottomStackedButton>
        <BottomButton $compact={compact} style={{ pointerEvents: "auto" }} onMouseDown={() => onClick && onClick(keys.space)}>
            <b>Drop</b>
        </BottomButton>
    </div>;
}
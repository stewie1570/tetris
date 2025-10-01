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

const LeftButton = styled(ControlButton)`
    left: 0px;
    top: 0px;
    width: 50%;
    height: 100%;
    font-size: 2rem;
`;

const RightButton = styled(ControlButton)`
    right: 0px;
    top: 0px;
    width: 50%;
    height: 100%;
    font-size: 2rem;
`;

const TopButton = styled(ControlButton)`
    left: 15%;
    top: 0px;
    width: 70%;
    height: 15%;
    font-size: 1.5rem;
`;

const TopStackedButton = styled(ControlButton)`
    left: 15%;
    top: 15%;
    width: 70%;
    height: 15%;
    font-size: 1.1rem;
`;

const BottomStackedButton = styled(ControlButton)`
    left: 15%;
    bottom: 15%;
    width: 70%;
    height: 15%;
    font-size: 2rem;
`;

const BottomButton = styled(ControlButton)`
    left: 15%;
    bottom: 0px;
    width: 70%;
    height: 15%;
    font-size: 1.2rem;
`;

export function MobileControls(props) {
    return <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <LeftButton style={{ pointerEvents: "auto" }} onMouseDown={() => props.onClick && props.onClick(keys.left)}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </LeftButton>
        <RightButton style={{ pointerEvents: "auto" }} onMouseDown={() => props.onClick && props.onClick(keys.right)}>
            <FontAwesomeIcon icon={faArrowRight} />
        </RightButton>
        <TopButton style={{ pointerEvents: "auto" }} onMouseDown={() => props.onClick && props.onClick(keys.up)}>
            <FontAwesomeIcon icon={faRotate} />
        </TopButton>
        {props.onPause && <TopStackedButton style={{ pointerEvents: "auto" }} onMouseDown={props.onPause}>
            <FontAwesomeIcon icon={faPause} />
            &nbsp;
            <b>Pause</b>
        </TopStackedButton>}
        <BottomStackedButton style={{ pointerEvents: "auto" }} onMouseDown={() => props.onClick && props.onClick(keys.down)}>
            <FontAwesomeIcon icon={faArrowDown} />
        </BottomStackedButton>
        <BottomButton style={{ pointerEvents: "auto" }} onMouseDown={() => props.onClick && props.onClick(keys.space)}>
            <b>Drop</b>
        </BottomButton>
    </div>;
}
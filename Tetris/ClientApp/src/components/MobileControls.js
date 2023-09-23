import { keys } from '../core/constants'
import React from 'react'
import styled from 'styled-components';

const LeftButton = styled.button`
    position: fixed;
    left: 0px;
    top: 0px;
    width: 15%;
    height: 100%;
    opacity: 0.5;
`;

const TopButton = styled.button`
    position: fixed;
    left: 15%;
    top: 0px;
    width: 70%;
    height: 15%;
    opacity: 0.5;
`;

const TopStackedButton = styled.button`
    position: fixed;
    left: 15%;
    top: 15%;
    width: 70%;
    height: 15%;
    opacity: 0.5;
`;

const RighButton = styled.button`
    position: fixed;
    top: 0px;
    right: 0px;
    width: 15%;
    height: 100%;
    opacity: 0.5;
`;

const BottomStackedButton = styled.button`
    position: fixed;
    left: 15%;
    bottom: 15%;
    width: 70%;
    height: 15%;
    opacity: 0.5;
`;

const BottomButton = styled.button`
    position: fixed;
    left: 15%;
    bottom: 0px;
    width: 70%;
    height: 15%;
    opacity: 0.5;
`;

export function MobileControls(props) {
    return <div style={{ position: "fixed", zIndex: 1 }}>
        <LeftButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.left)}>
        </LeftButton>
        <RighButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.right)}>
        </RighButton>
        <TopButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.up)}>
            <b>Rotate</b>
        </TopButton>
        {props.onPause && <TopStackedButton className="btn btn-primary" onClick={props.onPause}>
            <b>Pause</b>
        </TopStackedButton>}
        <BottomStackedButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.down)}>
        </BottomStackedButton>
        <BottomButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.space)}>
            <b>Commit</b>
        </BottomButton>
    </div>;
}
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
            <span className="glyphicon glyphicon-arrow-left">
                &nbsp;
            </span>
        </LeftButton>
        <RighButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.right)}>
            <span className="glyphicon glyphicon-arrow-right">
                &nbsp;
            </span>
        </RighButton>
        <TopButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.up)}>
            <span className="glyphicon glyphicon-refresh">
                &nbsp;
            </span>
            <b>Rotate</b>
        </TopButton>
        {props.onPause && <TopStackedButton className="btn btn-primary" onClick={props.onPause}>
            <span className="glyphicon glyphicon-pause">
                &nbsp;
            </span>
            <b>Pause</b>
        </TopStackedButton>}
        <BottomStackedButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.down)}>
            <span className="glyphicon glyphicon-arrow-down">
                &nbsp;
            </span>
        </BottomStackedButton>
        <BottomButton className="btn btn-primary" onClick={() => props.onClick && props.onClick(keys.space)}>
            <span className="glyphicon glyphicon-check">
                &nbsp;
            </span>
            <b>Commit</b>
        </BottomButton>
    </div>;
}
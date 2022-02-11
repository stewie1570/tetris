import './MobileControls.css'
import { keys } from '../core/constants'
import React from 'react'

export function MobileControls(props) {
    return <div style={{ position: "fixed", zIndex: 1 }}>
        <button className="btn btn-primary left-control" onClick={() => props.onClick && props.onClick(keys.left)}>
            <span className="glyphicon glyphicon-arrow-left">
                &nbsp;
            </span>
        </button>
        <button className="btn btn-primary right-control" onClick={() => props.onClick && props.onClick(keys.right)}>
            <span className="glyphicon glyphicon-arrow-right">
                &nbsp;
            </span>
        </button>
        <button className="btn btn-primary top-control" onClick={() => props.onClick && props.onClick(keys.up)}>
            <span className="glyphicon glyphicon-refresh">
                &nbsp;
            </span>
            <b>Rotate</b>
        </button>
        {props.onPause && <button className="btn btn-primary top-stacked-control" onClick={props.onPause}>
            <span className="glyphicon glyphicon-pause">
                &nbsp;
            </span>
            <b>Pause</b>
        </button>}
        <button className="btn btn-primary bottom-stacked-control" onClick={() => props.onClick && props.onClick(keys.down)}>
            <span className="glyphicon glyphicon-arrow-down">
                &nbsp;
            </span>
        </button>
        <button className="btn btn-primary bottom-control" onClick={() => props.onClick && props.onClick(keys.space)}>
            <span className="glyphicon glyphicon-check">
                &nbsp;
            </span>
            <b>Commit</b>
        </button>
    </div>;
}
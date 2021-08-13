import './MobileControls.css'
import { keys } from '../core/constants'
import React from 'react'

export function MobileControls(props) {
    return <div style={{ marginBottom: "650px", float: "left" }}>
        <button className="btn btn-primary left-control" onClick={() => props.onClick && props.onClick(keys.left)}>
            <b>&lt;-</b>
        </button>
        <button className="btn btn-primary right-control" onClick={() => props.onClick && props.onClick(keys.right)}>
            <b>-&gt;</b>
        </button>
        <button className="btn btn-primary top-control" onClick={() => props.onClick && props.onClick(keys.up)}>
            <b>Rotate</b>
        </button>
        <button className="btn btn-primary bottom-stacked-control" onClick={() => props.onClick && props.onClick(keys.down)}>
            <b>Down</b>
        </button>
        <button className="btn btn-primary bottom-control" onClick={() => props.onClick && props.onClick(keys.space)}>
            <b>Commit</b>
        </button>
    </div>;
}
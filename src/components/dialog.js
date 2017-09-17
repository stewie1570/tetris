import './dialog.css';
import React from 'react';

export class Dialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = { visible: props.visible };
    }

    hide() {
        this.setState({ visible: false });
    }

    exit() {
        this.props.onExit && this.props.onExit();
        this.hide();
    }

    show() {
        this.setState({ visible: true });
    }

    render() {
        return <div style={{ display: this.state.visible ? 'block' : 'none' }} className="dialog">
            <div className="dialog-shade" />
            <div
                className="dialog-container well">
                <div className="dialog-hide-container">
                    <span
                        className="dialog-hide-text"
                        onClick={this.exit.bind(this)}>
                        X
                    </span>
                </div>
                <div className="dialog-content">
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}
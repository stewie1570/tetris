import './error-message.css';
import React from 'react';

export class ErrorMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { visible: false };
    }

    componentWillMount() {
        window.onerror = errorMessage => this.setState({ visible: true, errorMessage })
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        return <div
            className="error-container"
            style={{ display: this.state.visible ? 'block' : 'none' }}>
            <div className="hide-container">
                <span
                    className="hide-text"
                    onClick={this.hide.bind(this)}>
                    X
                </span>
            </div>
            {(this.state.errorMessage || "").replace("Uncaught Error: ", "")}
        </div>;
    }
}
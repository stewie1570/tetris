import React from 'react'

export class CommandButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { running: false };
    }

    onClick = source => {
        this.setState({ running: true });
        var notRunning = () => this.setState({ running: false });
        try {
            var clickResult = this.props.onClick && this.props.onClick(source);

            return (clickResult
                && clickResult.then
                && clickResult.then(notRunning, notRunning))
                || notRunning();
        }
        catch (ex) {
            notRunning();
            throw ex;
        }
    }

    render() {
        const { runningText, disabled, type, ...otherProps } = this.props;

        return <button {...otherProps}
            onClick={this.onClick}
            disabled={disabled || this.state.running}
            type={type || "button"}>
            {this.state.running ? runningText : this.props.children}
        </button>;
    }
};
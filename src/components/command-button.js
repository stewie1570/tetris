import React from 'react'

export class CommandButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { running: false };
    }

    onClick(source) {
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
        const { runningText, ...otherProps } = this.props;

        return <button {...otherProps} onClick={this.onClick.bind(this)} disabled={this.state.running}>
            {this.state.running ? runningText : this.props.children}
        </button>;
    }
};
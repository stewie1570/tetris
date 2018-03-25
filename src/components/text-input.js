import React from 'react';

export class TextInput extends React.Component {
    update = (event) => this.props.onChange && this.props.onChange(event.target.value);

    componentDidMount() {
        this.props.autofocus && this.textBox.focus();
    }

    focus = () => this.textBox.focus();

    render() {
        var { autofocus, ...otherProps } = this.props;

        return <input
            {...otherProps}
            type="text"
            value={this.props.value}
            ref={ref => this.textBox = ref}
            onChange={this.update} />;
    }
}
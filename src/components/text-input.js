import React from 'react';

export class TextInput extends React.Component {
    update(event) {
        return this.props.onChange && this.props.onChange(event.target.value);
    }

    render() {
        return <input
            {...this.props}
            type="text"
            value={this.props.value}
            onChange={this.update.bind(this)} />;
    }
}
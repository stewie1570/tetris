import './prompt-dialog.css'
import { Dialog } from './dialog'
import React from 'react'
import { CommandButton } from './command-button'
import { TextInput } from './text-input'

export class PromptDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = { message: "", userInput: "" };
    }

    ask({ message }) {
        this.setState({ message, userInput: "" });
        this.dialog.show();
        this.promise = new Promise(resolve => this.resolve = resolve);

        return this.promise;
    }

    userRespondedWith(userInput) {
        this.dialog.hide();
        this.resolve(userInput);
    }

    render() {
        return <Dialog ref={ref => this.dialog = ref} onExit={() => this.resolve(null)}>
            <div className="centered">
                {this.state.message}
                <br />
                <TextInput
                    value={this.state.userInput}
                    onChange={userInput => this.setState({ userInput })} />
                <br />
                <CommandButton
                    className="btn btn-primary space-top-right"
                    onClick={() => this.userRespondedWith(null)}>
                    Cancel
                </CommandButton>
                <CommandButton
                    className="btn btn-primary space-top-right"
                    onClick={() => this.userRespondedWith(this.state.userInput)}>
                    Ok
                </CommandButton>
            </div>
        </Dialog>
    }
}
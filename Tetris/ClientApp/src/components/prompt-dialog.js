import "./prompt-dialog.css";
import { Dialog } from "./dialog";
import React from "react";
import { CommandButton } from "./command-button";
import { TextInput } from "./text-input";

export class PromptDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = { message: "", userInput: "" };
  }

  ask({ message, inputName }) {
    this.setState({ message, userInput: "", inputName });
    this.dialog.show();
    this.promise = new Promise((resolve) => (this.resolve = resolve));

    return this.promise;
  }

  userRespondedWith(userInput) {
    this.dialog.hide();
    this.resolve(userInput);
  }

  render() {
    return (
      <Dialog
        ref={(ref) => (this.dialog = ref)}
        onExit={() => this.resolve(null)}
      >
        <div className="centered">
          <form
            onSubmit={(event) =>
              event.preventDefault() || this.okButton.onClick()
            }
            name="dialog-form"
          >
            <label>
              {this.state.message}
              <br />
              <TextInput
                value={this.state.userInput}
                autofocus={true}
                name={this.state.inputName}
                onChange={(userInput) => this.setState({ userInput })}
              />
            </label>
          </form>
          <CommandButton
            className="btn btn-primary space-top-right"
            onClick={() => this.userRespondedWith(null)}
          >
            <span className="glyphicon glyphicon-remove">&nbsp;</span>
            Cancel
          </CommandButton>
          <CommandButton
            className="btn btn-primary space-top"
            onClick={() => this.userRespondedWith(this.state.userInput)}
            ref={(ref) => (this.okButton = ref)}
          >
            <span className="glyphicon glyphicon-ok">&nbsp;</span>
            Ok
          </CommandButton>
        </div>
      </Dialog>
    );
  }
}

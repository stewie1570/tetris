import "./prompt-dialog.css";
import React, { useRef } from "react";
import { CommandButton } from "./command-button";
import { TextInput } from "./text-input";

export const usePrompt = () => {
  const [visible, setVisible] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [message, setMessage] = React.useState(null);
  const resolver = useRef(null);
  const promise = useRef(null);

  return {
    prompt: (message) => {
      promise.current = new Promise((resolve) => { resolver.current = resolve; });
      setVisible(true);
      setMessage(message);
      return promise.current;
    },
    promptDialogProps: {
      input,
      setInput,
      visible,
      message,
      resolve: (value) => {
        setVisible(false);
        resolver.current(value);
      }
    }
  };
}

export const PromptDialog = ({ visible, input, setInput, resolve, message }) => {

  return visible && <div className="modal" style={{ display: "block" }} role="dialog">
    <div className="dialog-shade" />
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button
            type="button"
            onClick={() => resolve(undefined)}
            className="close"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="centered">
            <form onSubmit={(event) => event.preventDefault()} name="dialog-form">
              <label>
                {message}
                <br />
                <TextInput value={input} autofocus={true} onChange={setInput} />
              </label>
            </form>
            <CommandButton
              className="btn btn-primary space-top-right"
              onClick={() => resolve(undefined)}
            >
              <span className="glyphicon glyphicon-remove">&nbsp;</span>
              Cancel
            </CommandButton>
            <CommandButton
              className="btn btn-primary space-top"
              onClick={() => resolve(input)}
              type="submit"
            >
              <span className="glyphicon glyphicon-ok">&nbsp;</span>
              Ok
            </CommandButton>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

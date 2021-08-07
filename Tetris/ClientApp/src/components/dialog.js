import "./dialog.css";
import React, { useRef } from 'react';
import { CommandButton } from './command-button';
import { TextInput } from './text-input';

export const usePrompt = () => {
    const [isVisible, setVisible] = React.useState(false);
    const resolver = useRef(undefined);
    const dialogContent = useRef(undefined);
    const resolveDialog = value => {
        resolver.current(value);
        setVisible(false);
    };

    return {
        prompt: (content) => {
            const promise = new Promise(resolve => {
                resolver.current = resolve;
            });
            dialogContent.current = content(resolveDialog);
            setVisible(true);
            return promise;
        },
        dialogProps: {
            isVisible,
            resolve: resolveDialog,
            children: dialogContent.current
        }
    };
};

export const Dialog = ({ isVisible, resolve, children }) => {
    return !isVisible
        ? <></>
        : <div className="modal" style={{ display: "block" }} role="dialog">
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
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
};

export function StringInput({ onSaveString, children, runningText }) {
    const [value, setValue] = React.useState("");

    return <form onSubmit={event => event.preventDefault()} name="dialog-form">
        <label>
            {children}
            <br />
            <TextInput value={value} autofocus={true} onChange={setValue} />
        </label>
        <br />
        <CommandButton
            className="btn btn-primary space-top-right"
            onClick={() => onSaveString(undefined)}
        >
            <span className="glyphicon glyphicon-remove">&nbsp;</span>
            Cancel
        </CommandButton>
        <CommandButton
            className="btn btn-primary space-top"
            onClick={() => onSaveString(value)}
            runningText={runningText}
            type="submit"
        >
            <span className="glyphicon glyphicon-ok">&nbsp;</span>
            Ok
        </CommandButton>
    </form>;
}
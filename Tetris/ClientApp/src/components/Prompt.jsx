import React, { useRef } from "react";
import { CommandButton } from "./CommandButton";
import { TextInput } from "./TextInput";
import { useMountedOnlyState } from "leaf-validator";
import { useEscapeKeyOnClick } from "../hooks/useEscapeKeyOnClick";
import styled from "styled-components";

const StyledTextInput = styled(TextInput)`
  display: inherit;
`;

export const usePrompt = () => {
  const [isVisible, setVisible] = useMountedOnlyState(false);
  const resolver = useRef(undefined);
  const dialogContent = useRef(undefined);
  const resolveDialog = (value) => {
    resolver.current(value);
    setVisible(false);
  };

  useEscapeKeyOnClick({ onEscapeKeyClick: () => resolveDialog(undefined) });

  return {
    prompt: (content) => {
      const promise = new Promise((resolve) => {
        resolver.current = resolve;
      });
      dialogContent.current = content(resolveDialog);
      setVisible(true);
      return promise;
    },
    dialogProps: {
      isVisible,
      resolve: resolveDialog,
      children: dialogContent.current,
    },
  };
};

export const Dialog = ({ isVisible, resolve, children }) => {
  return !isVisible ? (
    <></>
  ) : (
    <div className="modal" style={{ display: "block" }} role="dialog">
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
            <div className="centered">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function StringInput({
  onSubmitString,
  children,
  filter,
  inputFilter,
  submittingText,
  initialValue,
}) {
  const [value, setValue] = React.useState(initialValue || "");

  return (
    <form onSubmit={(event) => event.preventDefault()} name="dialog-form">
      <label style={{ width: "100%" }}>
        <div className="mb-3">{children}</div>

        <StyledTextInput
          className="form-control"
          value={value}
          autofocus
          onChange={(str) => setValue(inputFilter?.(str) || str)}
        />
      </label>
      <div className="d-flex flex-column-reverse flex-lg-row-reverse align-items-center">
        <CommandButton
          className="btn btn-primary space-top ml-lg-2"
          style={{ width: "100%" }}
          onClick={() => onSubmitString(filter ? filter(value) : value)}
          runningText={submittingText}
          type="submit"
        >
          Ok
        </CommandButton>
        <CommandButton
          style={{ width: "100%" }}
          className="btn btn-light space-top"
          onClick={() => onSubmitString(undefined)}
        >
          Cancel
        </CommandButton>
      </div>
    </form>
  );
}

import React, { useRef } from "react";
import { CommandButton } from "./CommandButton";
import { TextInput } from "./TextInput";
import { useMountedOnlyState } from "leaf-validator";
import { useEscapeKeyOnClick } from "../hooks/useEscapeKeyOnClick";
import styled from "styled-components";

const StyledTextInput = styled(TextInput)`
  display: inherit;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #2d3748;
  font-weight: 500;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.2);
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }

  &::placeholder {
    color: rgba(45, 55, 72, 0.6);
  }
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

const ModalShade = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1040;
`;

const ModalDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
  width: 90%;
  max-width: 500px;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #2d3748;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #e53e3e;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  color: #2d3748;
`;

export const Dialog = ({ isVisible, resolve, children }) => {
  return !isVisible ? (
    <></>
  ) : (
    <div className="modal" style={{ display: "block" }} role="dialog">
      <ModalShade />
      <ModalDialog role="document">
        <ModalContent>
          <ModalHeader>
            <div></div>
            <CloseButton
              type="button"
              onClick={() => resolve(undefined)}
              aria-label="Close"
            >
              <span>&times;</span>
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <div className="centered">{children}</div>
          </ModalBody>
        </ModalContent>
      </ModalDialog>
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
        <div className="mb-3" style={{ 
          color: "#2d3748", 
          fontWeight: "600", 
          fontSize: "1.1rem",
          lineHeight: "1.5"
        }}>{children}</div>

        <StyledTextInput
          className="form-control"
          value={value}
          autofocus
          onChange={(str) => setValue(inputFilter?.(str) || str)}
        />
      </label>
      <div className="d-flex flex-column-reverse flex-lg-row-reverse align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
        <CommandButton
          className="btn btn-primary space-top ml-lg-2"
          style={{ 
            width: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            fontWeight: "600",
            color: "white",
            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease"
          }}
          onClick={() => onSubmitString(filter ? filter(value) : value)}
          runningText={submittingText}
          type="submit"
        >
          Ok
        </CommandButton>
        <CommandButton
          style={{ 
            width: "100%",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            padding: "12px 24px",
            fontWeight: "600",
            color: "#2d3748",
            transition: "all 0.3s ease"
          }}
          className="btn btn-light space-top"
          onClick={() => onSubmitString(undefined)}
        >
          Cancel
        </CommandButton>
      </div>
    </form>
  );
}

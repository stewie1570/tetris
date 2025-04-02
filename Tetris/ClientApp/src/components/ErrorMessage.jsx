import React from "react";
import styled from 'styled-components';
import { useLifeCycle } from '../hooks/useLifeCycle';
import { useEscapeKeyOnClick } from "../hooks/useEscapeKeyOnClick";

const ErrorModalHeader = styled.div`
  padding:9px 15px;
  border-bottom:1px solid #eee;
  background-color: hsl(0, 100%, 81%);
  -webkit-border-top-left-radius: 5px;
  -webkit-border-top-right-radius: 5px;
  -moz-border-radius-topleft: 5px;
  -moz-border-radius-topright: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

export const ErrorMessage = () => {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(null);
  const errorContainer = React.useRef(null);

  const windowClick = ({ target }) => !errorContainer.current.contains(target)
    && visible
    && hide();

  const showError = ({ detail: errorMessage }) => {
    setError(errorMessage);
    setVisible(true);
  }

  const hide = () => setVisible(false);

  useEscapeKeyOnClick({ onEscapeKeyClick: hide });

  useLifeCycle({
    onMount: () => {
      window.addEventListener("click", windowClick);
      window.addEventListener("touchstart", windowClick);
      window.addEventListener("user-error", showError);
    },
    onUnMount: () => {
      window.removeEventListener("click", windowClick);
      window.removeEventListener("touchstart", windowClick);
      window.removeEventListener("user-error", showError);
    }
  });


  return (
    <div
      className="modal"
      style={{ display: visible ? "block" : "none" }}
      role="dialog"
    >
      <div className="dialog-shade" />
      <div
        className="modal-dialog"
        ref={errorContainer}
        role="document"
      >
        <div className="modal-content">
          <ErrorModalHeader className="modal-header">
            <b>Error</b>
            <button
              type="button"
              onClick={hide}
              className="close"
              aria-label="Close"
            >
              <span>&times;</span>
            </button>
          </ErrorModalHeader>
          <div className="modal-body">
            {(error || "").replace("Uncaught Error: ", "")}
          </div>
        </div>
      </div>
    </div>
  );
}

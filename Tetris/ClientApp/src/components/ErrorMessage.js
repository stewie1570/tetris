import "./ErrorMessage.css";
import React, { useEffect } from "react";

export const ErrorMessage = () => {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(null);
  const errorContainer = React.useRef(null);

  const windowClick = ({ target }) => !errorContainer.current.contains(target)
    && visible
    && hide();

  useEffect(() => {
    const showError = ({ detail: errorMessage }) => {
      setError(errorMessage);
      setVisible(true);
    }

    window.addEventListener("click", windowClick);
    window.addEventListener("touchstart", windowClick);
    window.addEventListener("user-error", showError);

    return () => {
      window.removeEventListener("click", windowClick);
      window.removeEventListener("touchstart", windowClick);
      window.removeEventListener("user-error", showError);
    }
  }, []);

  const hide = () => setVisible(false);

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
          <div className="modal-header modal-header-error">
            <b>Error</b>
            <button
              type="button"
              onClick={hide}
              className="close"
              aria-label="Close"
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {(error || "").replace("Uncaught Error: ", "")}
          </div>
        </div>
      </div>
    </div>
  );
}

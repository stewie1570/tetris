import React from "react";
import { CommandButton } from "./CommandButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export const CopyButton = ({ text }) => (
  <CommandButton
    style={{ display: "inline", padding: 0 }}
    className="btn btn-link"
    onClick={async () => {
      await Promise.all([
        navigator.clipboard.writeText(text),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    }}
    runningText="Copying..."
  >
    <FontAwesomeIcon icon={faCopy} />
    &nbsp; Copy
  </CommandButton>
);

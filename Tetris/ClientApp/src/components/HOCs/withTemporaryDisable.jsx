import React from "react";
import { useLifeCycle } from "../../hooks/useLifeCycle";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const withTemporaryDisable = (Component) => {
  return ({ disableForMilliseconds, ...props }) => {
    const [disabled, setDisabled] = React.useState(
      Boolean(disableForMilliseconds)
    );

    useLifeCycle({
      onMount: () =>
        disableForMilliseconds &&
        wait(disableForMilliseconds).then(() => setDisabled(false)),
    });

    return <Component {...props} disabled={disabled || props.disabled} />;
  };
};

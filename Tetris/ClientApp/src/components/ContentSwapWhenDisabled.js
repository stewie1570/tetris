export const ContentSwapWhenDisabled = ({
  disabled,
  disabledContent,
  children,
}) => (disabled ? disabledContent : children);

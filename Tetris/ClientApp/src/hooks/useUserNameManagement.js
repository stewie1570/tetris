import { useCallback } from "react";
import { Spinner } from "../components/AnimatedIcons";
import { StringInput } from "../components/Prompt";

const trimHubExceptionMessage = (message) => {
  const seperator = "HubException: ";
  return message.split(seperator)[1] ?? message;
};

export const useUserNameManagement = ({
  prompt,
  gameHub,
  organizerUserId,
  currentUserId,
  setUsername,
  username
}) => {
  const promptUserName = useCallback(() => {
    return prompt((exitModal) => (
      <StringInput
        filter={(value) => (value ?? "").trim()}
        onSubmitString={async (name) => {
          name
            ? await gameHub.invoke
              .status({
                groupId: organizerUserId,
                message: {
                  userId: currentUserId,
                  name: name,
                },
              })
              .then(() => setUsername(name))
              .then(exitModal)
              .catch(({ message }) =>
                window.dispatchEvent(
                  new CustomEvent("user-error", {
                    detail: trimHubExceptionMessage(message),
                  })
                )
              )
            : exitModal();
        }}
        submittingText={
          <>
            <Spinner /> Setting user name...
          </>
        }
        initialValue={username}
      >
        What user name would you like?
      </StringInput>
    ));
  }, [prompt, gameHub, organizerUserId, currentUserId, setUsername, username]);

  return {
    promptUserName
  };
};

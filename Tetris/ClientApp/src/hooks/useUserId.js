import { randomIdGenerator } from "../randomIdGenerator";
import { useSessionStorageState } from "./useSessionStorageState";
import { useLifeCycle } from "./useLifeCycle";

export const useUserId = (defaultUserIdGenerator) => {
    const [userId, setUserId] = useSessionStorageState('userId');

    useLifeCycle({
        onMount: () => {
            const userIdGenerator = defaultUserIdGenerator || randomIdGenerator;
            !userId && setUserId(userIdGenerator());
        }
    });

    return userId;
};

import { useEffect } from "react";
import { randomIdGenerator } from "../randomIdGenerator";
import { useSessionStorageState } from "./useSessionStorageState";

export const useUserId = (defaultUserIdGenerator) => {
    const [userId, setUserId] = useSessionStorageState('userId');

    useEffect(() => {
        const userIdGenerator = defaultUserIdGenerator || randomIdGenerator;
        !userId && setUserId(userIdGenerator());
    }, []);

    return userId;
};

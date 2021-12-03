import { useEffect } from "react";
import { useSessionStorageState } from "./useSessionStorageState";
import { randomUserIdGenerator } from "../App";

export const useUserId = (defaultUserIdGenerator) => {
    const [userId, setUserId] = useSessionStorageState('userId');

    useEffect(() => {
        const userIdGenerator = defaultUserIdGenerator || randomUserIdGenerator;
        !userId && setUserId(userIdGenerator());
    }, []);

    return userId;
};

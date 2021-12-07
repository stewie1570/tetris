import { useEffect } from "react";
import { useSessionStorageState } from "./useSessionStorageState";

const randomUserIdGenerator = () => Math.random().toString(36).substring(7);

export const useUserId = (defaultUserIdGenerator) => {
    const [userId, setUserId] = useSessionStorageState('userId');

    useEffect(() => {
        const userIdGenerator = defaultUserIdGenerator || randomUserIdGenerator;
        !userId && setUserId(userIdGenerator());
    }, []);

    return userId;
};

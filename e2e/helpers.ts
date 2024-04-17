export function getTestEnv() {
    const localhost = 'localhost:5001';
    const host = process.env.host ?? localhost;
    const isLocalTest = host === localhost;

    return { isLocalTest, host }
}
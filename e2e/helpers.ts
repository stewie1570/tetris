export function getTestEnv() {
    const localhost = 'https://localhost:5001';
    const homePageUrl = process.env.host ?? localhost;
    const isLocalTest = homePageUrl === localhost;

    return { isLocalTest, homePageUrl }
}
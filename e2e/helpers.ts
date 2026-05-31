import { Page } from '@playwright/test';

export function getTestEnv() {
    const localhost = 'https://localhost:5001';
    const homePageUrl = process.env.host ?? localhost;
    const isLocalTest = homePageUrl === localhost;

    return { isLocalTest, homePageUrl }
}

export async function getGameRoomCodeFrom(page: Page) {
    const codeRow = page
        .locator('.card')
        .filter({ has: page.getByText('Connectivity', { exact: true }) })
        .getByRole('row')
        .filter({ has: page.getByText('Code', { exact: true }) });

    const codeText = await codeRow.locator('td').first().textContent();
    return codeText!.trim().split(/\s/)[0];
}

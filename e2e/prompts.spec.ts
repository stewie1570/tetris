import { test, expect } from '@playwright/test';
import { getTestEnv } from './helpers';

test.use({
  ignoreHTTPSErrors: true
});

const { homePageUrl, isLocalTest } = getTestEnv();

test('username text input is initialized with current user name', async ({ page }) => {
  await page.goto(homePageUrl);
  await page.getByRole('link', { name: 'Host Multiplayer Game' }).click();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await page.getByLabel('What user name would you like?').fill('Stewart');
  await page.getByLabel('What user name would you like?').press('Enter');
  await page.getByText('Stewart').dblclick();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await expect(await page.getByLabel('What user name would you like?')).toHaveValue("Stewart");
});

test("escape key can be used to close error message and prompt modals", async ({ page }) => {
  await page.goto(homePageUrl);
  if (isLocalTest) {
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(await page.getByText('Error', { exact: true })).toBeVisible();
    await page.locator('body').press('Escape');
    await expect(await page.getByText('Error', { exact: true })).not.toBeVisible();
  }
  await page.getByRole('button', { name: 'Join Multiplayer Game' }).click();
  await expect(await page.getByText('Code:')).toBeVisible();
  await page.getByLabel('Code:').press('Escape');
  await expect(await page.getByText('Code:')).not.toBeVisible();
})
import { test, expect } from '@playwright/test';

test('Username text input is initialized with current user name', async ({ page }) => {
  await page.goto('http://localhost:5000/');
  await page.getByRole('link', { name: 'Host Multiplayer Game' }).click();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await page.getByLabel('What user name would you like?').fill('Stewart');
  await page.getByLabel('What user name would you like?').press('Enter');
  await page.getByText('Stewart').dblclick();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await expect(await page.getByLabel('What user name would you like?')).toHaveValue("Stewart");
});
import { test, chromium, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('start a multiplayer game', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  await browserPage1.goto('https://localhost:5001/');
  await browserPage1.getByRole('link', { name: 'Host Multiplayer Game' }).click();
  const gameRoomCode = await browserPage1
    .getByRole('cell', { name: 'Code', exact: true })
    .locator('..')
    .getByRole('cell')
    .nth(1)
    .textContent();
  await browserPage1.getByRole('button', { name: 'Set User Name' }).click();
  const userNamePromptLabel = browserPage1.getByLabel('What user name would you like?');
  await userNamePromptLabel.fill('browser page 1');
  await userNamePromptLabel.press('Enter');
  await expect(browserPage1.getByText('browser page 1')).toBeVisible();
  await browserPage1.getByRole('button', { name: 'Start Game' });

  await browserPage2.goto('https://localhost:5001/');
  await browserPage2.getByRole('button', { name: 'Join Multiplayer Game' }).click();
  await browserPage2.getByRole('dialog')
    .filter({ hasText: 'Error×An error occurred.' })
    .getByRole('button', { name: 'Close' })
    .click();
  await browserPage2.getByLabel('Code:').click();
  await browserPage2.getByLabel('Code:').fill(gameRoomCode ?? '');
  await browserPage2.getByRole('button', { name: ' Ok' }).click();
  await browserPage2.getByRole('button', { name: 'Set User Name' }).click();
  await browserPage2.getByLabel('What user name would you like?').fill('browser page 2');
  await browserPage2.getByLabel('What user name would you like?').press('Enter');
  await expect(browserPage1.getByText('browser page 2')).toBeVisible();
  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText("browser page 2")).toBeVisible();
  await expect(await browserPage2.getByText("browser page 1")).toBeVisible();
  await context1.close();
  await context2.close();
});

async function newBrowserPage() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  return { browser, context, page };
}


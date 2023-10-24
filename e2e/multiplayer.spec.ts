import { test, chromium, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('start a multiplayer game', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await expect(browserPage1.getByText('browser page 2')).toBeVisible();
  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText("browser page 2")).toBeVisible();
  await expect(await browserPage2.getByText("browser page 1")).toBeVisible();

  await context1.close();
  await context2.close();
});

test('cant start an already in-progress game', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await expect(browserPage1.getByText('browser page 2')).toBeVisible();
  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText("browser page 2")).toBeVisible();
  await expect(await browserPage2.getByText("browser page 1")).toBeVisible();

  await browserPage2.getByRole('link', { name: 'Single Player Game' }).click();
  await browserPage2.getByRole('button', { name: 'Pause' }).click();
  await browserPage2.getByRole('dialog')
    .filter({ hasText: 'Error×An error occurred.' })
    .getByRole('button', { name: 'Close' })
    .click();
  await browserPage2.goBack();
  await expect(await browserPage2.getByText("Game ends in")).toBeVisible();
  await expect(await browserPage2.getByRole('button', { name: 'Start Game' })).toBeDisabled();
  await expect(await browserPage2.getByText('Score: 0')).not.toBeVisible();

  await context1.close();
  await context2.close();
});

test('disconnected warning shows when organizer disconnects from a game in-progress and disappear when organizer returns', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText("browser page 2")).toBeVisible();
  await expect(await browserPage2.getByText("browser page 1")).toBeVisible();

  await browserPage1.getByRole('link', { name: 'Single Player Game' }).click();

  await expect(await browserPage2.getByText('Organizer is disconnected.')).toBeVisible();

  await browserPage1.goBack();

  await expect(await browserPage2.getByText('Organizer is disconnected.')).not.toBeVisible();

  await context1.close();
  await context2.close();
});

test('Organizer has disconnected screen appears and replaces all else when organizer disconnects from game not in-progress', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await browserPage1.getByRole('link', { name: 'Single Player Game' }).click();

  await expect(await browserPage2.getByText('Organizer has disconnected.')).toBeVisible();
  await expect(await browserPage2.getByRole('button', { name: 'Start Game' })).not.toBeVisible();

  await browserPage1.goBack();

  await expect(await browserPage2.getByText('Organizer has disconnected.')).not.toBeVisible();
  await expect(await browserPage2.getByRole('button', { name: 'Start Game' })).toBeVisible();

  await context1.close();
  await context2.close();
});

async function joinMultiplayerGame({ guestBrowserPage, gameRoomCode }) {
  await guestBrowserPage.goto('https://localhost:5001/');
  await guestBrowserPage.getByRole('button', { name: 'Join Multiplayer Game' }).click();
  await guestBrowserPage.getByRole('dialog')
    .filter({ hasText: 'Error×An error occurred.' })
    .getByRole('button', { name: 'Close' })
    .click();
  await guestBrowserPage.getByLabel('Code:').click();
  await guestBrowserPage.getByLabel('Code:').fill(gameRoomCode ?? '');
  await guestBrowserPage.getByRole('button', { name: 'Ok' }).click();
  await guestBrowserPage.getByRole('button', { name: 'Set User Name' }).click();
  await guestBrowserPage.getByLabel('What user name would you like?').fill('browser page 2');
  await guestBrowserPage.getByLabel('What user name would you like?').press('Enter');
}

async function hostMultiplayerGameOn({ hostBrowserPage }) {
  await hostBrowserPage.goto('https://localhost:5001/');
  await hostBrowserPage.getByRole('link', { name: 'Host Multiplayer Game' }).click();
  const gameRoomCode = await hostBrowserPage
    .getByRole('cell', { name: 'Code', exact: true })
    .locator('..')
    .getByRole('cell')
    .nth(1)
    .textContent();
  await hostBrowserPage.getByRole('button', { name: 'Set User Name' }).click();
  const userNamePromptLabel = hostBrowserPage.getByLabel('What user name would you like?');
  await userNamePromptLabel.fill('browser page 1');
  await userNamePromptLabel.press('Enter');
  await expect(hostBrowserPage.getByText('browser page 1')).toBeVisible();
  await hostBrowserPage.getByRole('button', { name: 'Start Game' });
  return gameRoomCode;
}

async function newBrowserPage() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  return { browser, context, page };
}


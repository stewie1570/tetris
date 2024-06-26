import { test, chromium, expect } from '@playwright/test';
import { getTestEnv } from './helpers';

test.use({
  ignoreHTTPSErrors: true
});

const { homePageUrl, isLocalTest } = getTestEnv();

test('start a multiplayer game', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();
  const { page: browserPage3 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });
  await joinMultiplayerGame({ guestBrowserPage: browserPage3, gameRoomCode }, "browser page 3");

  await expect(browserPage1.getByText('browser page 2')).toHaveCount(2);
  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText(/^browser page 2$/)).toBeVisible();
  await expect(await browserPage2.getByText(/^browser page 1$/)).toBeVisible();
  await expect(await browserPage1.getByText(/^browser page 3$/)).toBeVisible();
  await expect(await browserPage2.getByText(/^browser page 3$/)).toBeVisible();
  await expect(await browserPage3.getByText(/^browser page 1$/)).toBeVisible();
  await expect(await browserPage3.getByText(/^browser page 2$/)).toBeVisible();

  await expect(await browserPage1.getByText("Score: 0")).toHaveCount(3);
  await expect(await browserPage2.getByText("Score: 0")).toHaveCount(3);
  await expect(await browserPage3.getByText("Score: 0")).toHaveCount(3);

  await context1.close();
  await context2.close();
});

test('start a multiplayer game via the game rooms table', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await browserPage2.goto(homePageUrl);
  await browserPage2
    .getByText(gameRoomCode)
    .locator('..')
    .getByRole('link', { name: 'Join' })
    .click({ timeout: 15000 });
  await setUserName(browserPage2, 'browser page 2');

  await expect(browserPage1.getByText('browser page 2')).toHaveCount(2);
  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText(/^browser page 2$/)).toBeVisible();
  await expect(await browserPage2.getByText(/^browser page 1$/)).toBeVisible();

  await context1.close();
  await context2.close();
});

test("players can chat with each other", async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await expect(await browserPage1.getByText("[browser page 2 connected]")).toBeVisible();

  await browserPage1.getByRole('textbox').fill('here is some chat');
  await browserPage1.getByRole('textbox').press('Enter');
  await expect(await browserPage1.getByText('browser page 1: here is some chat')).toBeVisible();
  await expect(await browserPage2.getByText('browser page 1: here is some chat')).toBeVisible();

  await browserPage2.getByRole('textbox').fill('here is a response');
  await browserPage2.getByRole('textbox').press('Enter');
  await expect(await browserPage1.getByText('browser page 2: here is a response')).toBeVisible();
  await expect(await browserPage2.getByText('browser page 2: here is a response')).toBeVisible();

  await setUserName(browserPage1, 'browser page one');
  await setUserName(browserPage2, 'browser page two');
  await expect(await browserPage1.getByText('browser page one: here is some chat')).toBeVisible();
  await expect(await browserPage2.getByText('browser page one: here is some chat')).toBeVisible();
  await expect(await browserPage1.getByText('browser page two: here is a response')).toBeVisible();
  await expect(await browserPage2.getByText('browser page two: here is a response')).toBeVisible();

  await browserPage2.getByRole('link', { name: 'Single Player Game' }).click();
  await browserPage2.getByRole('button', { name: 'Pause' }).click();
  if (isLocalTest) {
    await browserPage2.getByRole('dialog')
      .filter({ hasText: 'Error×An error occurred.' })
      .getByRole('button', { name: 'Close' })
      .click();
  }
  await browserPage2.goBack();
  await expect(await browserPage2.getByText("[browser page two disconnected]")).toBeVisible();

  await browserPage2.getByRole('link', { name: 'Single Player Game' }).click();
  await browserPage2.getByRole('button', { name: 'Pause' }).click();
  if (isLocalTest) {
    await browserPage2.getByRole('dialog')
      .filter({ hasText: 'Error×An error occurred.' })
      .getByRole('button', { name: 'Close' })
      .click();
  }
  await browserPage2.goBack();
  await expect(await browserPage2.getByText("[browser page two disconnected]")).toHaveCount(2);

  await context1.close();
  await context2.close();
});

test("chat is reset with the rest of the game context", async () => {
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await browserPage1.getByRole('textbox').fill('here is some chat');
  await browserPage1.getByRole('textbox').press('Enter');
  await expect(await browserPage1.getByText('browser page 1: here is some chat')).toBeVisible();
  await expect(await browserPage2.getByText('browser page 1: here is some chat')).toBeVisible();

  await browserPage1.getByRole('link', { name: 'Single Player Game' }).click();
  await browserPage1.getByRole('button', { name: 'Pause' }).click();
  if (isLocalTest) {
    await browserPage1.getByRole('dialog')
      .filter({ hasText: 'Error×An error occurred.' })
      .getByRole('button', { name: 'Close' })
      .click();
  }
  await browserPage1.goBack();
  await expect(await browserPage1.getByText("browser page 1")).toBeVisible();

  await expect(await browserPage1.getByText('browser page 1: here is some chat')).not.toBeVisible();
  await expect(await browserPage2.getByText('browser page 1: here is some chat')).not.toBeVisible();

  await context1.close();
  await context2.close();
});

test('cant start an already in-progress game', async () => {
  test.setTimeout(60000);
  const { page: browserPage1, context: context1 } = await newBrowserPage();
  const { page: browserPage2, context: context2 } = await newBrowserPage();

  const gameRoomCode = await hostMultiplayerGameOn({ hostBrowserPage: browserPage1 });

  await joinMultiplayerGame({ guestBrowserPage: browserPage2, gameRoomCode });

  await expect(browserPage1.getByText('browser page 2')).toHaveCount(2);
  await browserPage1.getByRole('button', { name: 'Start Game' }).click();
  await expect(await browserPage1.getByText(/^browser page 2$/)).toBeVisible();
  await expect(await browserPage2.getByText(/^browser page 1$/)).toBeVisible();

  await browserPage2.getByRole('link', { name: 'Single Player Game' }).click();
  await browserPage2.getByRole('button', { name: 'Pause' }).click();
  if (isLocalTest) {
    await browserPage2.getByRole('dialog')
      .filter({ hasText: 'Error×An error occurred.' })
      .getByRole('button', { name: 'Close' })
      .click();
  }
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
  await expect(await browserPage1.getByText(/^browser page 2$/)).toBeVisible();
  await expect(await browserPage2.getByText(/^browser page 1$/)).toBeVisible();

  await browserPage1.getByRole('link', { name: 'Single Player Game' }).click();

  await expect(await browserPage2.getByText('Organizer is disconnected.')).toBeVisible();

  await browserPage1.goBack();

  await expect(await browserPage2.getByText('Organizer is disconnected.')).not.toBeVisible();

  await context1.close();
  await context2.close();
});

test('organizer has disconnected screen appears and replaces all else when organizer disconnects from game not in-progress', async () => {
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

test("can't set user name that is too long", async ({ page }) => {
  await page.goto(homePageUrl);
  await page.getByRole('link', { name: 'Host Multiplayer Game' }).click();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await page.getByLabel('What user name would you like?').fill('stewart');
  await page.getByLabel('What user name would you like?').press('Enter');
  await expect(await page.getByText('stewart')).toBeVisible();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await page.getByLabel('What user name would you like?').fill('stewart mcphie anderson');
  await page.getByLabel('What user name would you like?').press('Enter');
  await expect(await page.getByText('Name must be 20 characters or less.')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Error×$/ }).getByLabel('Close').click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Set User Name' }).click();
  await page.getByLabel('What user name would you like?').click();
  await page.getByLabel('What user name would you like?').fill('stewie');
  await page.getByLabel('What user name would you like?').press('Enter');
  await expect(await page.getByText('stewie')).toBeVisible();
});

async function joinMultiplayerGame({ guestBrowserPage, gameRoomCode }, name?: string) {
  await guestBrowserPage.goto(homePageUrl);
  await guestBrowserPage.getByRole('button', { name: 'Join Multiplayer Game' }).click();
  if (isLocalTest) {
    await guestBrowserPage.getByRole('dialog')
      .filter({ hasText: 'Error×An error occurred.' })
      .getByRole('button', { name: 'Close' })
      .click();
  }
  await guestBrowserPage.getByLabel('Code:').click();
  await guestBrowserPage.getByLabel('Code:').fill(gameRoomCode ?? '');
  await guestBrowserPage.getByRole('button', { name: 'Ok' }).click();
  await setUserName(guestBrowserPage, name ?? 'browser page 2');
}

async function setUserName(guestBrowserPage: any, userName: string) {
  await guestBrowserPage.getByRole('button', { name: 'Set User Name' }).click();
  await guestBrowserPage.getByLabel('What user name would you like?').fill(userName);
  await guestBrowserPage.getByLabel('What user name would you like?').press('Enter');
}

async function hostMultiplayerGameOn({ hostBrowserPage }) {
  await hostBrowserPage.goto(homePageUrl);
  await hostBrowserPage.getByRole('link', { name: 'Host Multiplayer Game' }).click();
  const gameRoomCode = (await hostBrowserPage
    .getByRole('cell', { name: 'Code', exact: true })
    .locator('..')
    .getByRole('cell')
    .nth(1)
    .textContent())
    .split(' ')[0];
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


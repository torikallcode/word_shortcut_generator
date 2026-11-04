import { expect, test } from '@playwright/test';

test('builds and downloads a Normal.dotm with command and style shortcuts', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start empty' }).click();
  await expect(page.getByRole('heading', { name: 'Shortcut editor' })).toBeVisible();

  // Style shortcut: Ctrl+Alt+1 collides with the Word default, so overwrite it.
  await page.getByRole('button', { name: 'Styles', exact: true }).click();
  await page
    .getByRole('button', { name: /Heading 1/ })
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Control+Alt+1');
  await expect(page.getByText('This combination belongs to Word')).toBeVisible();
  await page.getByRole('button', { name: 'Overwrite' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  // Command shortcut: Ctrl+Alt+B is not a Word default.
  await page.getByRole('button', { name: 'Commands', exact: true }).click();
  await page.getByRole('button', { name: /^Bold/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Control+Alt+b');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.getByRole('button', { name: 'Review and download' }).click();
  await expect(page.getByRole('heading', { name: 'Review and download' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Heading 1' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Bold', exact: true })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Normal.dotm' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('Normal.dotm');
  await download.saveAs('test-results/Normal.dotm');
});

test('blocks download until a Word default conflict is overwritten', async ({ page }) => {
  await page.goto('/#/editor');
  await page.getByRole('button', { name: 'Commands', exact: true }).click();
  await page.getByRole('button', { name: /^Bold/ }).first().click();

  await page.keyboard.press('Control+b');
  await expect(page.getByText('This combination belongs to Word')).toBeVisible();

  // Leaving the conflict unresolved blocks the summary download.
  await page.getByRole('button', { name: 'Choose another' }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Review and download' }).click();
  await expect(page.getByRole('button', { name: 'Download Normal.dotm' })).toBeDisabled();
});

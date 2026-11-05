import { expect, test } from '@playwright/test';

test('applies the Skripsi preset and downloads a Normal.dotm with 10 shortcuts', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByLabel('Use a preset').selectOption('skripsi');
  await expect(page.getByText('10 shortcut(s) ready to export')).toBeVisible();
  await expect(page.getByText('15 item(s) waiting for support')).toBeVisible();

  await page.getByRole('button', { name: 'Apply preset' }).click();
  await expect(page).toHaveURL(/#\/editor$/);
  await expect(page.getByText('10 shortcut(s)')).toBeVisible();
  await expect(page.getByText('Heading 9')).toBeVisible();

  await page.getByRole('button', { name: 'Review and download' }).click();
  await expect(page.getByRole('heading', { name: 'Review and download' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Normal', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Heading 9' })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Normal.dotm' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Normal.dotm');
});

import { expect, test } from '@playwright/test';

test('home page renders and starts an empty editor', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Normal.dotm');

  await page.getByRole('button', { name: 'Start empty' }).click();
  await expect(page).toHaveURL(/#\/editor$/);
  await expect(page.getByRole('heading', { name: 'Shortcut editor' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Bold/ }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Review and download' }).click();
  await expect(page.getByRole('heading', { name: 'Nothing to download yet' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download Normal.dotm' })).toBeDisabled();
});

test('switches the whole interface to Indonesian', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^id$/i }).click();

  await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Normal.dotm');

  await page.getByRole('link', { name: 'Panduan' }).click();
  await expect(page.getByRole('heading', { name: 'Panduan pemasangan' })).toBeVisible();
});

test('installation guide shows both platform paths', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Guide' }).click();

  await expect(page.getByText('%AppData%\\Microsoft\\Templates')).toBeVisible();

  await page
    .getByRole('group', { name: 'Installation guide' })
    .getByRole('button', { name: 'macOS' })
    .click();
  await expect(page.getByText('UBF8T346G9.Office')).toBeVisible();
});

test('unsupported routes return home', async ({ page }) => {
  await page.goto('/#/does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Normal.dotm');
});

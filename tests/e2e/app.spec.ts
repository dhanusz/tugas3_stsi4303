import { expect, test } from '@playwright/test';

test('menampilkan daftar cryptocurrency dari API CoinLore', async ({ page }) => {
  await page.goto('/');

  // Tombol Refresh ada di header
  const refreshButton = page.getByRole('button', { name: /refresh/i });
  await expect(refreshButton).toBeVisible();

  // Tunggu sampai data dari API tampil
  const firstRow = page.getByTestId('coin-row').first();
  await expect(firstRow).toBeVisible({ timeout: 20_000 });

  // Baris pertama harus Bitcoin (rank 1, simbol BTC)
  await expect(firstRow).toContainText('Rank');
  await expect(firstRow).toContainText('Bitcoin');
  await expect(firstRow).toContainText('BTC');

  // Jumlah baris sama dengan jumlah koin yang dikembalikan API (100)
  await expect(page.getByTestId('coin-row')).toHaveCount(100);
});

test('Refresh memuat ulang data tanpa error', async ({ page }) => {
  await page.goto('/');

  const refreshButton = page.getByRole('button', { name: /refresh/i });
  await expect(refreshButton).toBeVisible();
  await expect(page.getByTestId('coin-row').first()).toBeVisible({ timeout: 20_000 });

  await refreshButton.click();

  // Setelah refresh, tabel tetap terisi dan tidak masuk mode error
  await expect(page.getByTestId('coin-row')).toHaveCount(100, { timeout: 20_000 });
  await expect(page.getByTestId('error')).toHaveCount(0);
});

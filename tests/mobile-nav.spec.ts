import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

test('hamburger menu visibility', async ({ page }) => {
  // Use baseUrl from config or default to 4173
  await page.goto('./');

  const hamburger = page.locator('.VPNavBarHamburger');
  await expect(hamburger).toBeVisible();

  await hamburger.click();

  // NavScreen should become visible
  const navScreen = page.locator('.VPNavScreen');
  await expect(navScreen).toBeVisible();

  // Navigation links should be visible
  const guidesLink = page.getByRole('link', { name: 'Guides' });
  await expect(guidesLink).toBeVisible();
});

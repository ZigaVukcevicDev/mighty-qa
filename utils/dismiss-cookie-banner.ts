import { Page } from '@playwright/test';

export async function dismissCookieBanner(page: Page) {
  const banner = page.locator('div[role="dialog"][aria-label="cookieconsent"]');
  const dismissBtn = banner.locator('a.cc-btn.cc-dismiss');

  if ((await banner.isVisible()) && (await dismissBtn.isVisible())) {
    await dismissBtn.click();
    await banner.waitFor({ state: 'hidden' });
  }
}

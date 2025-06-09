import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/');
  await page.fill('input[type="email"]', process.env.EMAIL || '');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.fill('input[type="password"]', process.env.PASSWORD || '');
  await page.getByRole('button', { name: 'Submit' }).click();
}

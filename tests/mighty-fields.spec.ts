import { test, expect } from '@playwright/test';
import { login } from '../utils/login';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { dismissCookieBanner } from '../utils/dismiss-cookie-banner';

dotenv.config();

/**
 * Notes for code reviewer
 *
 * 1. Login flow
 * The application no longer accepts both Email and Password fields in the same step as stated in the test instructions — these are now handled in separate steps.
 *
 * 2. Selectors
 * Normally, using labels, HTML tags, or class names for selectors is discouraged, as these can easily change and break tests. It is more robust to use data attributes like `data-test-id`, `data-testid`, or `data-test`. However, since I don’t have access to the application code to add such attributes, I used the best available selectors in the DOM.
 *
 * 3. Test cleanup
 * I usually ensure test data is cleaned up, but in this case, the application disables the delete buttons. I apologize for the leftover test entries in the system.
 *
 * 4. Language switching
 * I believe there is a bug in the language switching mechanism. The login screen appears in Slovenian. After logging in, the interface switches to English. Upon refreshing, it switches again — this time to Italian.
 */

test('MightyFields case test', async ({ page }) => {
  await login(page);

  // Wait for dashboard
  await page.waitForSelector('text=Start a new case');

  // Start a new case
  await page.locator('.sidebar a:has(.fa-plus)').click();

  // Choose category "test"
  const category = page.locator('h4', { hasText: /^test$/ }); // Use regex to match the exact text "test"
  await expect(category).toBeVisible(); // Ensure the title is visible before clicking
  await category.click();

  // Choose template "SimpleTestForm"
  const template = page.locator('h4', { hasText: 'SimpleTestForm' });
  await expect(template).toBeVisible();
  await template.click();

  // Update name with a unique identifier and confirm
  const name = page.locator('.sweet-alert input[type="text"]');
  const value = await name.inputValue();
  const uuid = uuidv4();
  const updatedValue = `${value} ${uuid}`;

  await name.fill(updatedValue);
  await page.locator('.sweet-alert button.confirm').click();

  // Filling form fields
  await page.locator('sf-input:has-text("Name") input[type="text"]').fill('John Doe');
  await page.locator('sf-input:has-text("Age") input[type="tel"]').fill('24');

  // Manually close the cookie banner before clicking "Next"
  await dismissCookieBanner(page);
  await page.getByRole('button', { name: 'Next' }).click();

  // Click the "Close case" button
  await page.locator('button#close').click();

  // Click the "Yes" button to confirm
  await page.locator('button.confirm').click();

  // Click the "OK" button to finalize
  await page.locator('button.confirm', { hasText: 'OK' }).click();

  // Wait for the closed case title containing the UUID to appear
  const closedCaseTitle = page.locator(`.case-data .title:has-text("${uuid}")`);
  await closedCaseTitle.waitFor({ state: 'visible' });

  // Verify the closed case contains the UUID in its title
  await expect(closedCaseTitle).toContainText(uuid);
});

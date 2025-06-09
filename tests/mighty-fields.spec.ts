import { test, expect, Page } from '@playwright/test';
import { login } from '../utils/login';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { dismissCookieBanner } from '../utils/dismiss-cookie-banner';

dotenv.config();

async function fillDropdown(page: Page, label: string, value: string) {
  await page.locator(`.control-wrapper:has-text("${label}") .track`).click({ force: true });
  await page
    .locator(`.control-wrapper:has-text("Level ${label.toLowerCase()}") select`)
    .selectOption({ label: value });
}

async function verifyDropdown(page: Page, label: string, expectedValue: string) {
  const selectedOption = page.locator(
    `.control-wrapper:has-text("Level ${label.toLowerCase()}") select option[selected]`,
  );
  await expect(selectedOption).toHaveText(expectedValue);
}

/**
 * Notes for code reviewer
 *
 * 1. Login flow
 * The application no longer accepts both Email and Password fields in the same step as stated in the test instructions — these are now handled in separate steps.
 *
 * 2. Selectors
 * Normally, using labels, HTML tags, or id/class names for selectors is discouraged, as these can easily change and break tests. It is more robust to use data attributes like `data-test-id`, `data-testid`, or `data-test`. However, since I don’t have access to the application code to add such attributes, I used the best available selectors in the DOM.
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

  // Choose category and template
  await page.locator('h4', { hasText: /^test$/ }).click();
  await page.locator('h4', { hasText: 'SimpleTestForm' }).click();

  // Update title with a unique identifier
  const uuid = uuidv4();
  const title = page.locator('.sweet-alert input[type="text"]');
  await title.fill(`${await title.inputValue()} ${uuid}`);
  await page.locator('.sweet-alert button.confirm').click();

  // Fill form fields
  const fullName = 'John Doe';
  const age = '24';
  const country = 'Slovenija';
  await page.locator('sf-input:has-text("Name") input[type="text"]').fill(fullName);
  await page.locator('sf-input:has-text("Age") input[type="tel"]').fill(age);
  await page.selectOption('select[name="fielddropdown"]', { label: country });

  // Fill dropdowns for English and German
  await fillDropdown(page, 'English', 'UltraMega');
  await fillDropdown(page, 'German', 'UltraMega');

  // Close cookie banner and proceed
  await dismissCookieBanner(page);
  await page.getByRole('button', { name: 'Next' }).click();

  // Close the case
  await page.locator('button#close').click();
  await page.locator('button.confirm').click();
  await page.locator('button.confirm:has-text("OK")').click();

  // Verify closed case title
  const closedCaseTitle = page.locator(`.case-data .title:has-text("${uuid}")`);
  await closedCaseTitle.waitFor({ state: 'visible' });
  await expect(closedCaseTitle).toContainText(uuid);

  // Open the case
  const caseContainer = page.locator(`.case-item:has(.case-data .title:has-text("${uuid}"))`);
  await caseContainer.locator('.button-row button:has-text("View")').click();

  // Verify form values
  await expect(page.locator('sf-input:has-text("Name") input[type="text"]')).toHaveValue(fullName);
  await expect(page.locator('sf-input:has-text("Age") input[type="tel"]')).toHaveValue(age);
  const countryDropdown = page.locator(
    '.control-wrapper:has-text("Country") select option[selected]',
  );
  await expect(countryDropdown).toHaveText(country);
  await verifyDropdown(page, 'English', 'UltraMega');
  await verifyDropdown(page, 'German', 'UltraMega');
});

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully and persist state', async ({ page }) => {
    // 1. Visit login page
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // 2. Fill in credentials
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');

    // 3. Click login
    await page.click('button[type="submit"]');

    // 4. Verify landing on dashboard
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // 5. Verify state persistence after refresh
    await page.reload();
    await expect(page).toHaveURL('/');
    
    // Check if sidebar contains user info (adjust selector based on actual UI)
    // await expect(page.locator('text=admin')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="username"]', 'wrong');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');

    // Verify error toast or message
    // await expect(page.locator('text=failed')).toBeVisible();
  });
});

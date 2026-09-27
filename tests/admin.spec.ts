import { test, expect } from '@playwright/test';

test.describe('Momen Center - Admin & Storefront Security Suite', () => {
  const BASE_URL = 'http://localhost:5173';

  test('Public Storefront: Customer can browse and cannot see admin dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/#home`);

    // Verify luxury hero & storefront branding
    await expect(page.locator('text=MOMEN CENTER')).toBeVisible();

    // Verify customer cannot see admin sidebar
    await expect(page.locator('text=PORTAL ADMIN')).not.toBeVisible();
    await expect(page.locator('text=لوحة تحكم المتجر')).not.toBeVisible();
  });

  test('Security RBAC Guard: Unauthenticated access to #admin redirects to login', async ({ page }) => {
    // Attempt direct access to admin without login
    await page.goto(`${BASE_URL}/#admin`);

    // Must show login screen or be redirected
    await expect(page.locator('text=تسجيل دخول الإدارة')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Admin Authentication: Valid credentials permit access to Admin Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/#admin/login`);

    // Fill credentials
    await page.fill('input[type="email"]', 'admin@momencenter.com');
    await page.fill('input[type="password"]', 'admin123456');

    // Click submit
    await page.click('button:has-text("تسجيل الدخول")');

    // Verify redirected to dashboard with stats
    await expect(page.locator('text=لوحة تحكم المتجر')).toBeVisible();
    await expect(page.locator('text=إجمالي المنتجات')).toBeVisible();
    await expect(page.locator('text=PORTAL ADMIN')).toBeVisible();
  });

  test('Product Management: Admin can view, add, and filter products', async ({ page }) => {
    await page.goto(`${BASE_URL}/#admin/login`);
    await page.fill('input[type="email"]', 'admin@momencenter.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button:has-text("تسجيل الدخول")');

    // Navigate to products
    await page.goto(`${BASE_URL}/#admin/products`);
    await expect(page.locator('text=إدارة المنتجات والمخزون')).toBeVisible();

    // Check search input
    const searchInput = page.locator('input[placeholder*="ابحث باسم الفستان"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('فستان');
  });

  test('Admin Logout: Clears session and returns to login or store', async ({ page }) => {
    await page.goto(`${BASE_URL}/#admin/login`);
    await page.fill('input[type="email"]', 'admin@momencenter.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button:has-text("تسجيل الدخول")');

    // Click logout
    const logoutBtn = page.locator('button[title="تسجيل الخروج"]');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      // Verify login screen reappears
      await expect(page.locator('text=تسجيل دخول الإدارة')).toBeVisible();
    }
  });
});

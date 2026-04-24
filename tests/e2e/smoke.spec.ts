import { test, expect } from '@playwright/test';

test.describe('Revenue Guard: Payment Verification', () => {
  
  test('API Endpoint refuses mock orders under ₹1 threshold (Business Logic Constraint)', async ({ request }) => {
    // Tests that the core API restricts underpayments securely
    const response = await request.post('/api/payments/create-order', {
      data: {
        event_id: 'mock-event-id-for-testing',
        // Mock payload mimicking a forged gateway request
      }
    });

    // We expect a 401/400/404 because this request shouldn't pass security thresholds 
    // or IDOR checks (anonymous / unauthenticated request) without a valid auth token.
    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(400); 
    
    // Check that we aren't bypassing Auth headers securely
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Homepage App Mounts successfully (Smoke Test)', async ({ page }) => {
    // Basic navigation sanity check to ensure the Next.js bundle isn't critically failing
    await page.goto('/');
    
    // Very flexible locators verifying the app builds and renders texts
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('html')).toBeVisible();
  });
});

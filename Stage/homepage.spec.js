
const { test, expect } = require('@playwright/test');

test('verify Playwright homepage', async ({ page }) => {
  await page.goto('https://stg-fe.aryzap.com//');

  await expect(page).toHaveTitle(/ARY PLUS - A Video Streaming Portal/);

});

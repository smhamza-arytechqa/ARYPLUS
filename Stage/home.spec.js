const { test, expect } = require('@playwright/test');

// test.describe('Home Page View', () => {
//     test.beforeEach(async ({ page }) => {
//         await page.goto('https://stg-fe.aryzap.com/');
//     });

//     test('Verify home page scrolling works', async ({ page }) => {
//         const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
//         const viewportHeight = await page.evaluate(() => document.documentElement.clientHeight);

//         expect(pageHeight).toBeGreaterThan(viewportHeight);

//         await page.evaluate(() => window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: 'smooth'
//         }));

//         await expect.poll(
//             () => page.evaluate(() => window.scrollY),
//             { timeout: 15000 }
//         ).toBeGreaterThan(0);

//         await page.evaluate(() => window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         }));

//         await expect.poll(
//             () => page.evaluate(() => window.scrollY),
//             { timeout: 15000 }
//         ).toBe(0);
//     });
// });


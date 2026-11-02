const { test, expect } = require('@playwright/test');

// test('sign-in page displays the login form', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/login');

//   await expect(page).toHaveTitle(/Login - ARY Plus/);
//   await expect(
//     page.getByRole('heading', { name: 'Unlimited movies, TV shows, and more' }),
//   ).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Enter email address' })).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Enter password' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
// });

// test('sign-in with valid credentials', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/login');

//   await expect(page).toHaveTitle(/Login - ARY Plus/);
//   await expect(
//     page.getByRole('heading', { name: 'Unlimited movies, TV shows, and more' }),
//   ).toBeVisible();
//   await page.getByPlaceholder('Enter email address').fill('smhamza@arytech.com');
//   await page.getByPlaceholder('Enter password').fill('Test@124');
//   await page.getByRole('button', { name: 'Sign In' }).click();
//   await page.waitForTimeout(2000);
//   await expect(page).toHaveTitle(/ARY PLUS - A Video Streaming Portal/);

//  });


// test('sign-in with invalid credentials', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/login');

//   await expect(page).toHaveTitle(/Login - ARY Plus/);
//   await expect(
//     page.getByRole('heading', { name: 'Unlimited movies, TV shows, and more' }),
//   ).toBeVisible();
//   await page.getByPlaceholder('Enter email address').fill('smhamza@arytech.com');
//   await page.getByPlaceholder('Enter password').fill('Test123');
//   await page.getByRole('button', { name: 'Sign In' }).click();
//   await page.pause();
// });


// test('Google Sign In', async ({ page, context }) => {

//     test.setTimeout(120000);

//     await page.goto('https://stg-fe.aryzap.com/login');

//     // Click Google Sign In
//     const [googlePage] = await Promise.all([
//         context.waitForEvent('page'),
//         page.getByRole('button', { name: /google/i }).click()
//     ]);

//     await googlePage.waitForLoadState('domcontentloaded');

//       // Wait for Google login page
//     await page.waitForURL(/accounts\.google\.com/);

//     await googlePage.waitForSelector('input[type="email"]', {
//     state: 'visible',
//     timeout: 30000
// });

// await googlePage.locator('input[type="email"]').fill('smhamza@arytech.com');

// await googlePage.getByRole('button', { name: 'Next' }).click();
// await googlePage.waitForSelector('input[type="password"]', {
//     state: 'visible',
//     timeout: 30000
// });

// await googlePage.locator('input[type="password"]').fill('Arytechhamza22$');

// await googlePage.getByRole('button', { name: 'Next' }).click();

//     // Verify successful login (adjust URL for your application)
//     await page.waitForURL('**/home');

//     console.log('Google Sign-In successful');

// });
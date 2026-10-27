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
//   await page.getByPlaceholder('Enter password').fill('Test@123');
//   await page.getByRole('button', { name: 'Sign In' }).click();
//   await page.waitForTimeout(2000);
//   await expect(page).toHaveTitle(/ARY PLUS - A Video Streaming Portal/);

// });


test('sign-in with invalid credentials', async ({ page }) => {
  await page.goto('https://stg-fe.aryzap.com/login');

  await expect(page).toHaveTitle(/Login - ARY Plus/);
  await expect(
    page.getByRole('heading', { name: 'Unlimited movies, TV shows, and more' }),
  ).toBeVisible();
  await page.getByPlaceholder('Enter email address').fill('smhamza@arytech.com');
  await page.getByPlaceholder('Enter password').fill('Test123');
  await page.getByRole('button', { name: 'Sign In' }).click();
});
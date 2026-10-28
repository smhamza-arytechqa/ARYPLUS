const { test, expect } = require('@playwright/test');

// test('sign-up page displays the registration form', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/signup');

//   await expect(
//     page.getByRole('heading', { name: 'Create an Account' }),
//   ).toBeVisible();
//   await expect(
//     page.getByRole('textbox', { name: 'Enter email address' }),
//   ).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
// });

test('sign-up with a valid email address', async ({ page }) => {
  await page.goto('https://stg-fe.aryzap.com/signup');

  await page
    .getByRole('textbox', { name: 'Enter email address' })
    .fill('tes@yopmail.com');
  await page.getByRole('button', { name: 'Get Started' }).click();

});


// test('sign-up with a invalid email address', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/signup');

//   await page
//     .getByRole('textbox', { name: 'Enter email address' })
//     .fill('tesyopmail.com');
//   await page.getByRole('button', { name: 'Get Started' }).click();

// });

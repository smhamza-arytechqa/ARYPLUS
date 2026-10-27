const { test, expect } = require('@playwright/test');

// test('Forgot password link', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/forgot-password');

//   await page.getByPlaceholder('Enter email address').fill('smhamza@arytech.com');
//   await page.getByRole('button', { name: 'Send Reset Link' }).click();
//   await page.pause();
// });


// test('After resend link redirection to yopmail', async ({ page, context }) => {
//   await page.goto('https://stg-fe.aryzap.com/forgot-password');

//   await page.getByPlaceholder('Enter email address').fill('te@yopmail.com');
//   await page.getByRole('button', { name: 'Send Reset Link' }).click();

//   // Open YOPmail in a new tab
//   const mailPage = await context.newPage();
//   await mailPage.goto('https://yopmail.com/');

//   // 6. Enter email on YOPmail
//   const yopmailInput = mailPage.locator('#login');

//   await expect(yopmailInput).toBeVisible();
//   await yopmailInput.fill('te@yopmail.com');

//   // 7. Click Check Inbox
//   await mailPage.locator('#refreshbut').click();

//   // 8. Wait for inbox and open latest email
//   const inboxFrame = mailPage.frameLocator('#ifinbox');
//   const latestEmail = inboxFrame.locator('div.m').first();

//   await expect(latestEmail).toBeVisible({ timeout: 30000 });
//   await latestEmail.click();

//   // 9. Read email content
//   const emailFrame = mailPage.frameLocator('#ifmail');
//   const emailBody = emailFrame.locator('body');

//   await expect(emailBody).not.toBeEmpty({ timeout: 20000 });
// });


test('Redirection to reset password link', async ({ page, context }) => {
  await page.goto('https://stg-fe.aryzap.com/forgot-password');

  await page.getByPlaceholder('Enter email address').fill('te@yopmail.com');
  await page.getByRole('button', { name: 'Send Reset Link' }).click();

  // Open YOPmail in a new tab
  const mailPage = await context.newPage();
  await mailPage.goto('https://yopmail.com/');

  // 6. Enter email on YOPmail
  const yopmailInput = mailPage.locator('#login');

  await expect(yopmailInput).toBeVisible();
  await yopmailInput.fill('te@yopmail.com');

  // 7. Click Check Inbox
  await mailPage.locator('#refreshbut').click();

  // 8. Wait for inbox and open latest email
  const inboxFrame = mailPage.frameLocator('#ifinbox');
  const latestEmail = inboxFrame.locator('div.m').first();

  await expect(latestEmail).toBeVisible({ timeout: 30000 });
  await latestEmail.click();

  // 9. Read email content
  const emailFrame = mailPage.frameLocator('#ifmail');
  const emailBody = emailFrame.locator('body');

  await expect(emailBody).not.toBeEmpty({ timeout: 20000 });

  // 10. Click Reset Password link
  const resetLink = emailFrame.getByRole('link', {
    name: /Click here/i
  }).first();
  

  const [resetPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
    resetLink.click()
  ]);

  const destination = resetPage || mailPage;

  await destination.waitForLoadState('domcontentloaded');

  // 11. Verify reset password page
  await expect(destination).toHaveURL(
    /reset-password|resetpassword|new-password/i,
    { timeout: 20000 }
  );

  console.log('Reset password page opened successfully.');
});

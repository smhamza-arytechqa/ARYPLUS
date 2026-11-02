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

// test('sign-up with a valid email address', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/signup');

//   await page
//     .getByRole('textbox', { name: 'Enter email address' })
//     .fill('tes@yopmail.com');
//   await page.getByRole('button', { name: 'Get Started' }).click();

// });


// test('sign-up with a invalid email address', async ({ page }) => {
//   await page.goto('https://stg-fe.aryzap.com/signup');

//   await page
//     .getByRole('textbox', { name: 'Enter email address' })
//     .fill('tesyopmail.com');
//   await page.getByRole('button', { name: 'Get Started' }).click();

// });


test('sign-up & Onboarding flow', async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  const email = `sign@yopmail.com`;

  await page.goto('https://stg-fe.aryzap.com/signup');

  await page
    .getByRole('textbox', { name: 'Enter email address' })
    .fill(email);
  await page.getByRole('button', { name: 'Get Started' }).click();

  // Read the verification code sent to YOPmail.
  const mailPage = await context.newPage();
  await mailPage.goto('https://yopmail.com/');
  await mailPage.locator('#login').fill(email);

  const inboxFrame = mailPage.frameLocator('#ifinbox');
  const latestEmail = inboxFrame.locator('div.m').first();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      await mailPage.locator('#refreshbut').click({ timeout: 5000 });
    } catch (error) {
      if (mailPage.isClosed()) throw error;
      await mailPage.reload({ waitUntil: 'domcontentloaded' });
      await mailPage.locator('#login').fill(email);
    }
    if (await latestEmail.isVisible()) break;
    await mailPage.waitForTimeout(5000);
  }
  await expect(latestEmail).toBeVisible({ timeout: 5000 });
  await latestEmail.click();

  const emailFrame = mailPage.frameLocator('#ifmail');
  const emailBody = emailFrame.locator('body');
  await expect(emailBody).not.toBeEmpty({ timeout: 20000 });

  const otp = await emailFrame.locator('body').evaluate((body) => {
    const text = body.innerText || body.textContent || '';
    const otpWithLabel = text.match(
      /(?:verification|otp|one-time|code)[^0-9]{0,20}(\d{4,8})/i,
    );
    if (otpWithLabel) return otpWithLabel[1];

    const standaloneCodes = text.match(/\b\d{4,8}\b/g) || [];
    return (
      standaloneCodes.find((code) => code.length === 6) ||
      standaloneCodes.find((code) => code.length >= 4) ||
      null
    );
  });

  expect(otp, 'OTP was not found in the verification email').toBeTruthy();

  await page.bringToFront();

  const otpInputs = page.locator(
    [
      'input[autocomplete="one-time-code"]',
      'input[name*="otp" i]',
      'input[name*="code" i]',
      'input[placeholder*="otp" i]',
      'input[aria-label*="otp" i]',
      'input[maxlength="1"]',
    ].join(','),
  );

  await expect(otpInputs.first()).toBeVisible({ timeout: 30000 });

  if ((await otpInputs.count()) === 1) {
    await otpInputs.first().fill(otp);
  } else {
    const visibleInputs = otpInputs.filter({ visible: true });
    const inputCount = await visibleInputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(otp.length);

    for (let index = 0; index < otp.length; index += 1) {
      await visibleInputs.nth(index).fill(otp[index]);
    }
  }

  await page.getByRole('button', { name: 'Verify', exact: true }).click();
  await expect(page).toHaveURL(/create-password/i, { timeout: 30000 });

  await page.getByPlaceholder('Enter name').fill('Test User');
  const dobInput = page.getByPlaceholder('Enter date of birth');
  await dobInput.click();

  const datePicker = page.getByRole('dialog', { name: 'Choose Date' });
  await expect(datePicker).toBeVisible({ timeout: 10000 });
  await datePicker.getByRole('button', { name: '2000', exact: true }).click();
  await datePicker.getByRole('gridcell', {
    name: /January 1st, 2000/i,
  }).click();

  await page.getByPlaceholder('Enter password').fill('Test@123');
  await page.getByPlaceholder('Enter confirm password').fill('Test@123');
  await page.locator('#termsCheckboxLogin').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await expect(page).toHaveURL(/gender-selection/i, { timeout: 30000 });
  await page.getByRole('button', { name: 'Male', exact: true }).click();
  await page.getByRole('button', { name: '24-34', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await expect(page).toHaveURL(/genre-preferences/i, { timeout: 30000 });
  await page.getByRole('button', { name: 'Romance', exact: true }).click();
  await page.getByRole('button', { name: 'Comedy', exact: true }).click();
  await page.getByRole('button', { name: 'Action', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await expect(page).toHaveURL('https://stg-fe.aryzap.com/', {
    timeout: 30000,
  });
  await expect(page.getByText('Test User').first()).toBeVisible({
    timeout: 30000,
  });
});
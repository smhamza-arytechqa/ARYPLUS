
const { test, expect } = require('@playwright/test');

test.describe('ARY Zap Header Navigation Redirection', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/');
    });

    const navigationItems = [
        'Exclusive',
        'Dramas',
        'Movies',
        'Telefilms',
        'Snips',
        'Shows',
        'Streams',
        'Sign In'
    ];

    for (const item of navigationItems) {

        test(`Verify ${item} navigation redirection`, async ({ page }) => {

            const header = page.locator('header');
            const menu = item === 'Sign In'
                ? header.getByRole('link', { name: /^Sign In\b/i }).first()
                : header.getByRole('link', { name: item, exact: true });

            await expect(menu).toBeVisible({ timeout: 15000 });

            // Capture actual destination URL
            const href = await menu.getAttribute('href');

            expect(href, `${item} link has no href`).toBeTruthy();

            const expectedURL = new URL(href, page.url());

            console.log(`${item} destination: ${expectedURL.href}`);

            // Click navigation menu
            await menu.click();

            // Wait for redirection
            await page.waitForURL(url =>
                url.origin === expectedURL.origin &&
                url.pathname.replace(/\/$/, '') ===
                expectedURL.pathname.replace(/\/$/, '')
            );

            // Verify navigation
            expect(new URL(page.url()).pathname.replace(/\/$/, ''))
                .toBe(expectedURL.pathname.replace(/\/$/, ''));

            console.log(`${item} navigation successful`);
        });
    }

});

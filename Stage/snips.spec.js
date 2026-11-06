const { test, expect } = require('@playwright/test');

test.describe('Snips', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 40000,
        });
    });

    test('Verify Snips navigation redirection', async ({ page }) => {
        const snipsLink = page.locator('header')
            .getByRole('link', { name: 'Snips', exact: true })
            .first();

        await expect(snipsLink).toBeVisible({ timeout: 15000 });

        const href = await snipsLink.getAttribute('href');
        expect(href, 'Snips link does not have a destination').toBeTruthy();

        await snipsLink.click();
        await page.waitForURL(url => {
            const expectedURL = new URL(href, page.url());
            return url.origin === expectedURL.origin
                && url.pathname.replace(/\/$/, '') ===
                expectedURL.pathname.replace(/\/$/, '');
        }, { timeout: 30000 });

        await expect(page).toHaveURL(/\/shorts\/?$/, { timeout: 30000 });
    });

    test('View two or three Snips', async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/shorts', {
            waitUntil: 'domcontentloaded',
            timeout: 40000,
        });

        const reels = page.locator('[class*="_short-container_"] [class*="_reel_"]');
        await expect(reels.first()).toBeAttached({ timeout: 30000 });
        expect(await reels.count()).toBeGreaterThanOrEqual(3);

        for (let index = 0; index < 3; index++) {
            const reel = reels.nth(index);
            await reel.scrollIntoViewIfNeeded();
            await expect(reel).toBeVisible({ timeout: 15000 });

            const video = reel.locator('video').first();
            await expect(video).toBeAttached({ timeout: 15000 });

            const title = reel.locator('[class*="_user-info_"]').first();
            await expect(title).toBeVisible({ timeout: 15000 });

            console.log(`Viewed Snip ${index + 1}: ${(await title.innerText()).trim()}`);
        }
    });
});
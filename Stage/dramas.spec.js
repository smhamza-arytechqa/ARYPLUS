const { test, expect } = require('@playwright/test');

test.describe('Dramas Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        });
    });

    test('Open Dramas tab, scroll, open a drama, and play with Watch Now', async ({ page }) => {
        const dramasTab = page.locator('header')
            .getByRole('link', { name: 'Dramas', exact: true })
            .first();

        await expect(dramasTab).toBeVisible({ timeout: 15000 });
        await dramasTab.click();
        await page.waitForURL(/\/view-all\/Category\/dramas/i, {
            timeout: 30000,
        });

        const dramaCards = page.locator('a[href*="/series/"]');
        await expect(dramaCards.first()).toBeAttached({ timeout: 30000 });

        const dramaContent = dramaCards.nth(3);
        await expect(dramaContent).toBeAttached({ timeout: 30000 });
        await dramaContent.scrollIntoViewIfNeeded();
        await expect(dramaContent).toBeVisible({ timeout: 15000 });

        await dramaContent.click();
        await page.waitForURL(/\/series\/.+/, { timeout: 30000 });

        const watchNow = page.getByRole('link', { name: /Watch Now/i }).first();
        await expect(watchNow).toBeVisible({ timeout: 30000 });

        const watchHref = await watchNow.getAttribute('href');
        expect(watchHref, 'Watch Now link does not have a destination').toBeTruthy();

        await watchNow.click();
        await page.waitForURL(/\/video\/v2\/.+/, { timeout: 30000 });

        const video = page.locator('video.main-video, video.video-horizontal, video').first();
        await expect(video).toBeVisible({ timeout: 30000 });

        await expect.poll(
            async () => {
                await video.evaluate(async element => {
                    if (element.paused) {
                        try {
                            await element.play();
                        } catch (error) {
                            if (error.name !== 'AbortError') {
                                throw error;
                            }
                        }
                    }
                });

                return video.evaluate(element => !element.paused);
            },
            { timeout: 15000 }
        ).toBe(true);
    });
});

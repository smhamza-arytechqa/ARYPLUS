const { test, expect } = require('@playwright/test');

test.describe('Exclusive Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 40000,
        });
    });

    test('Open Exclusive content, click Watch Now, and play video', async ({ page }) => {
        const exclusiveTab = page.locator('header')
            .getByRole('link', { name: 'Exclusive', exact: true })
            .first();

        await expect(exclusiveTab).toBeVisible({ timeout: 15000 });
        await exclusiveTab.click();
        await page.waitForURL(/\/view-all\/Category\/Tvod%20Exclusives/, {
            timeout: 30000,
        });

        const firstContent = page.locator('a[href*="/series/"]').first();
        await expect(firstContent).toBeAttached({ timeout: 30000 });
        await firstContent.scrollIntoViewIfNeeded();
        await firstContent.click();
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

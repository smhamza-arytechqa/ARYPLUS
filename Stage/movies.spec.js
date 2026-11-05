const { test, expect } = require('@playwright/test');

test.describe('Movies Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        });
    });

    test('Open Movie tab, scroll, open a movie, and play with Watch Now', async ({ page }) => {
        const movieTab = page.locator('header')
            .getByRole('link', { name: 'Movies', exact: true })
            .first();

        await expect(movieTab).toBeVisible({ timeout: 15000 });
        await movieTab.click();
        await page.waitForURL(/\/view-all\/Category\/movies/i, {
            timeout: 30000,
        });

        const moviesCards = page.locator('a[href*="/series/"]');
        await expect(moviesCards.first()).toBeAttached({ timeout: 30000 });

        const movieContent = moviesCards.first();
        await expect(movieContent).toBeAttached({ timeout: 30000 });
        await movieContent.scrollIntoViewIfNeeded();
        await expect(movieContent).toBeVisible({ timeout: 15000 });

        await movieContent.click();
        await page.waitForURL(/\/series\/.+/, { timeout: 30000 });

        const watchNow = page.getByRole('link', { name: /Watch Now/i }).first();
        await expect(watchNow).toBeVisible({ timeout: 30000 });

        const watchHref = await watchNow.getAttribute('href');
        expect(watchHref, 'Watch Now link does not have a destination').toBeTruthy();

        await watchNow.click();
        await page.waitForURL(/\/(?:video|watch)\/v2\/.+/, { timeout: 30000 });

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

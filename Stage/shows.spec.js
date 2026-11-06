const { test, expect } = require('@playwright/test');

test.describe('Shows Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        });
    });

    test('Open Shows tab, open any show, and play with Watch Now', async ({ page }) => {
        const showsTab = page.locator('header')
            .getByRole('link', { name: 'Shows', exact: true })
            .first();

        await expect(showsTab).toBeVisible({ timeout: 15000 });

        const showsHref = await showsTab.getAttribute('href');
        expect(showsHref, 'Shows link does not have a destination').toBeTruthy();

        await showsTab.click();
        await page.waitForURL(url => {
            const expectedUrl = new URL(showsHref, page.url());
            return url.origin === expectedUrl.origin
                && decodeURIComponent(url.pathname).replace(/\/$/, '') ===
                decodeURIComponent(expectedUrl.pathname).replace(/\/$/, '');
        }, { timeout: 30000 });

        const showCards = page.locator('a[href*="/series/"]');
        await expect(showCards.first()).toBeAttached({ timeout: 30000 });

        const showContent = showCards.first();
        await showContent.scrollIntoViewIfNeeded();
        await expect(showContent).toBeVisible({ timeout: 15000 });
        await showContent.click();

        await page.waitForURL(/\/series\/.+/, { timeout: 30000 });

        const watchNow = page.getByRole('link', { name: /Watch Now/i }).first();
        await expect(watchNow).toBeVisible({ timeout: 30000 });

        const watchHref = await watchNow.getAttribute('href');
        expect(watchHref, 'Watch Now link does not have a destination').toBeTruthy();

        await watchNow.click();
        await page.waitForURL(/\/(?:video|watch)\/v\d\/.+/, { timeout: 30000 });

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

        await expect.poll(
            () => video.evaluate(element => element.currentTime),
            { timeout: 15000 }
        ).toBeGreaterThan(0);
        await page.pause();
    });
});
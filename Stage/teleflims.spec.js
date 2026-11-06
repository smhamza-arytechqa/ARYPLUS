const { test, expect } = require('@playwright/test');

test.describe('Telefilms Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        });
    });

    test('Open Telefilms tab, open any telefilm, and play with Watch Now', async ({ page }) => {
        const telefilmsTab = page.locator('header')
            .getByRole('link', { name: 'Telefilms', exact: true })
            .first();

        await expect(telefilmsTab).toBeVisible({ timeout: 15000 });

        const telefilmsHref = await telefilmsTab.getAttribute('href');
        expect(telefilmsHref, 'Telefilms link does not have a destination').toBeTruthy();

        await telefilmsTab.click();
        await page.waitForURL(url => {
            const href = new URL(telefilmsHref, page.url());
            return url.origin === href.origin
                && url.pathname.replace(/\/$/, '') === href.pathname.replace(/\/$/, '');
        }, { timeout: 30000 });

        const telefilmCards = page.locator('a[href*="/series/"]');
        await expect(telefilmCards.first()).toBeAttached({ timeout: 30000 });

        const telefilmContent = telefilmCards.first();
        await telefilmContent.scrollIntoViewIfNeeded();
        await expect(telefilmContent).toBeVisible({ timeout: 15000 });
        await telefilmContent.click();

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
    });
});
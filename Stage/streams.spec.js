const { test, expect } = require('@playwright/test');

const baseURL = 'https://stg-fe.aryzap.com';
const streamsURL = `${baseURL}/view-all/Category/live%20streaming`;

test.describe('Live Streams', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL, {
            waitUntil: 'domcontentloaded',
            timeout: 40000,
        });
    });

    test('Verify Streams navigation redirection', async ({ page }) => {
        const streamsLink = page.locator('header')
            .getByRole('link', { name: 'Streams', exact: true })
            .first();

        await expect(streamsLink).toBeVisible({ timeout: 15000 });

        const href = await streamsLink.getAttribute('href');
        expect(href, 'Streams link does not have a destination').toBeTruthy();

        await streamsLink.click();
        await page.waitForURL(url => url.pathname.includes('/Category/live%20streaming'), {
            timeout: 30000,
        });

        await expect(page.locator('a.live-streaming-card').first()).toBeAttached({
            timeout: 30000,
        });
    });

    test('Open up to two live streams and play each', async ({ page }) => {
        test.setTimeout(180000);
        await page.goto(streamsURL, {
            waitUntil: 'domcontentloaded',
            timeout: 40000,
        });

        const streamCards = page.locator('a.live-streaming-card');
        await expect(streamCards.first()).toBeAttached({ timeout: 30000 });

        const cardCount = await streamCards.count();
        expect(cardCount, 'No live stream cards were found').toBeGreaterThan(0);

        let watched = 0;

        for (let index = 0; index < cardCount && watched < 2; index++) {
            await page.goto(streamsURL, {
                waitUntil: 'domcontentloaded',
                timeout: 40000,
            });

            const card = page.locator('a.live-streaming-card').nth(index);
            await expect(card).toBeAttached({ timeout: 30000 });
            await card.scrollIntoViewIfNeeded();

            const streamName = await card.getAttribute('aria-label') ||
                `Live stream ${index + 1}`;

            await card.click();
            await page.waitForURL(/\/series\/.+/, { timeout: 30000 });

            const watchNow = page.getByRole('link', { name: /Watch Now/i }).first();
            if (!(await watchNow.isVisible().catch(() => false))) {
                console.log(`Skipped ${streamName}: Watch Now is not available`);
                continue;
            }

            await watchNow.click();
            await page.waitForURL(/\/live\/v\d\/.+/, { timeout: 30000 });

            await expect.poll(
                async () => page.locator('video').count(),
                { timeout: 30000 }
            ).toBeGreaterThan(0);

            const videos = page.locator('video');
            let visibleVideo = null;

            for (let videoIndex = 0; videoIndex < await videos.count(); videoIndex++) {
                const candidate = videos.nth(videoIndex);
                if (await candidate.isVisible().catch(() => false)) {
                    visibleVideo = candidate;
                    break;
                }
            }

            expect(visibleVideo, `No visible video player found for ${streamName}`).not.toBeNull();
            await expect(visibleVideo).toBeVisible({ timeout: 30000 });

            await visibleVideo.evaluate(async element => {
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

            await expect.poll(
                () => visibleVideo.evaluate(element => ({
                    paused: element.paused,
                    readyState: element.readyState,
                    currentTime: element.currentTime,
                    errorCode: element.error ? element.error.code : null,
                })),
                { timeout: 30000 }
            ).toMatchObject({
                paused: false,
                readyState: 4,
                errorCode: null,
            });

            watched++;
            console.log(`Watched live stream ${watched}: ${streamName}`);
        }

        expect(watched, 'Expected at least one live stream to be playable').toBeGreaterThan(0);
        await page.pause();
    });
});
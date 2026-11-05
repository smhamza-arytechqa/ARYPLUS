const { test, expect } = require('@playwright/test');

// test.describe('Home Page View', () => {
//     test.beforeEach(async ({ page }) => {
//         await page.goto('https://stg-fe.aryzap.com/');
//     });

//     test('Verify home page scrolling works', async ({ page }) => {
//         const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
//         const viewportHeight = await page.evaluate(() => document.documentElement.clientHeight);

//         expect(pageHeight).toBeGreaterThan(viewportHeight);

//         await page.evaluate(() => window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: 'smooth'
//         }));

//         await expect.poll(
//             () => page.evaluate(() => window.scrollY),
//             { timeout: 15000 }
//         ).toBeGreaterThan(0);

//         await page.evaluate(() => window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         }));

//         await expect.poll(
//             () => page.evaluate(() => window.scrollY),
//             { timeout: 15000 }
//         ).toBe(0);
//     });
// });


test.describe('Video Player view on homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/');
    });

    test('Open slider banner video and play the video', async ({ page }) => {
        const watchNow = page.getByRole('link', { name: 'Watch Now' }).first();

        await expect(watchNow).toBeVisible({ timeout: 15000 });
        await watchNow.click();

        await page.waitForURL(/\/watch\/v1\/.+/, { timeout: 30000 });

        const video = page.locator('video.main-video').first();
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
                    return !element.paused;
                });

                return video.evaluate(element => !element.paused);
            },
            { timeout: 15000 }
        ).toBe(true);

        await expect.poll(
            () => video.evaluate(element => element.paused),
            { timeout: 15000 }
        ).toBe(false);
    });
});



const { test, expect } = require('@playwright/test');

test.describe('Header Navigation Redirection', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://stg-fe.aryzap.com/');
    });

    const navigationItems = [
        { name: 'Home', url: '/' },
        { name: 'Exclusive', url: '/exclusive' },
        { name: 'Dramas', url: '/dramas' },
        { name: 'Movies', url: '/movies' },
        { name: 'Telefilms', url: '/telefilms' },
        { name: 'Snips', url: '/snips' },
        { name: 'Shows', url: '/shows' },
        { name: 'Streams', url: '/streams' },
        { name: 'Sign In', url: '/signin' },
    ];

    for (const item of navigationItems) {

        test(`Verify ${item.name} navigation redirection`, async ({ page }) => {

            const menu = page.getByRole('link', {
                name: item.name,
                exact: true
            });

            await expect(menu).toBeVisible();

            await menu.click();

            await expect(page).toHaveURL(
                new RegExp(item.url.replace('/', '\\/') + '$')
            );

            console.log(`${item.name} navigation successful`);
        });
    }

});

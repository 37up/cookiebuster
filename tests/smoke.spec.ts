import { test, expect } from '@playwright/test';

const sites = [
    { name: 'malvernpanalytical', url: 'https://www.malvernpanalytical.com/' },
    { name: 'micromeritics', url: 'https://www.micromeritics.com/' }
];

for (const s of sites) {
    test(`smoke: loads ${s.name}`, async ({ page }) => {
        const resp = await page.goto(s.url, { waitUntil: 'domcontentloaded' });
        expect(resp, `No response for ${s.url}`).not.toBeNull();
        expect(resp!.status(), `Non-2xx/3xx for ${s.url}`).toBeLessThan(400);
        await expect(page).toHaveTitle(/.+/);
    });
}
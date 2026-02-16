import { test, expect } from '@playwright/test';
import fs from 'fs';

type SiteSpec = {
    name: string;
    url: string;
    essentialAllowed: string[];
    forbiddenPreConsent: string[];
};

function matches(patterns: string[], value: string) {
    return patterns.some(p => new RegExp(p).test(value));
}

const spec: SiteSpec = JSON.parse(
    fs.readFileSync('./specs/malvernpanalytical.json', 'utf-8')
);

test(`pre-consent enforcement: ${spec.name}`, async ({ page, context }) => {
    await page.goto(spec.url, { waitUntil: 'domcontentloaded' });

    const cookies = await context.cookies();
    const names = cookies.map(c => c.name);

    console.log(`COOKIE INVENTORY (${spec.name}):`, names);

    // 1️⃣ Hard fail: forbidden cookies exist pre-consent
    const forbidden = names.filter(n =>
        matches(spec.forbiddenPreConsent, n)
    );

    expect(
        forbidden,
        `Forbidden cookies detected pre-consent: ${forbidden.join(', ')}`
    ).toEqual([]);

    // 2️⃣ Soft log: unexpected cookies (not yet failing)
    const unexpected = names.filter(
        n => !matches(spec.essentialAllowed, n)
    );

    console.log(`Unexpected pre-consent cookies:`, unexpected);
});

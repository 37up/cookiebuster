import { test, expect } from '@playwright/test';

type SiteSpec = {
    name: string;
    url: string;
    essentialAllowList: (string | RegExp)[];
    forbiddenPreConsent: (string | RegExp)[];
};

const sites: SiteSpec[] = [
    {
        name: 'malvernpanalytical',
        url: 'https://www.malvernpanalytical.com/',
        essentialAllowList: [
            /^__cf/,
            /^ARRAffinity/,
            /^ai_session/,
            /^ai_user/
            // add your known essentials here
        ],
        forbiddenPreConsent: [
            /^_ga/,
            /^_gid/,
            /^_gcl/,
            /^_fbp/
            // add known non-essential patterns here
        ]
    },
    {
        name: 'micromeritics',
        url: 'https://www.micromeritics.com/',
        essentialAllowList: [
            /^__cf/,
            /^ARRAffinity/,
            /^ai_session/,
            /^ai_user/
        ],
        forbiddenPreConsent: [
            /^_ga/,
            /^_gid/,
            /^_gcl/,
            /^_fbp/
        ]
    }
];

function matchesAny(name: string, list: (string | RegExp)[]) {
    return list.some(x => typeof x === 'string' ? x === name : x.test(name));
}

for (const s of sites) {
    test(`pre-consent cookies: ${s.name}`, async ({ page, context }) => {
        await page.goto(s.url, { waitUntil: 'domcontentloaded' });

        const cookies = await context.cookies();
        const names = cookies.map(c => c.name).sort();

        console.log(`COOKIE_INVENTORY ${s.name}:`, names.join(', '));

        const forbidden = names.filter(n => matchesAny(n, s.forbiddenPreConsent));
        expect(forbidden, `Forbidden cookies pre-consent on ${s.name}: ${forbidden.join(', ')}`).toEqual([]);

        const nonEssential = names.filter(n => !matchesAny(n, s.essentialAllowList));
        // For now, log only (do not fail) until you’ve tuned the allowlist
        console.log(`NON_ESSENTIAL_CANDIDATES ${s.name}:`, nonEssential.join(', ') || '(none)');
    });
}

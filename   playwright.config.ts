import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    expect: { timeout: 10_000 },

    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,

    reporter: [
        ['line'],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['html', { outputFolder: 'playwright-report', open: process.env.CI ? 'never' : 'on-failure' }]
    ],

    use: {
        headless: true,
        viewport: { width: 1366, height: 768 },
        actionTimeout: 15_000,
        navigationTimeout: 45_000,
        trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
        screenshot: 'only-on-failure',
        video: process.env.CI ? 'retain-on-failure' : 'off'
    }
});

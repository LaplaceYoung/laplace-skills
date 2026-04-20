import { expect, test } from '@playwright/test';

const EXAMPLE_CASES = [
  {
    path: 'examples/prototype/index.html',
    text: 'Claude Design Prototype Example'
  },
  {
    path: 'examples/deck/index.html',
    text: 'Claude Design Deck Example'
  },
  {
    path: 'examples/animation/index.html',
    text: 'Claude Design Animation Example'
  },
  {
    path: 'examples/design-system/index.html',
    text: 'Claude Design Design System Example'
  },
  {
    path: 'examples/yang-meng-profile/index.html',
    text: '模态跃迁'
  }
] as const;

for (const example of EXAMPLE_CASES) {
  test(`browser regression: ${example.path}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/' + example.path);
    await expect(page.locator('body')).toContainText(example.text);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}

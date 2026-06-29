import { test, expect, type Page } from "@playwright/test";

/**
 * Verifies global scroll behavior:
 *  1. Link clicks (forward client-side navigation) scroll the new page to the top.
 *  2. Browser back restores the previous scroll position.
 *  3. Browser forward returns the navigated-to page to the top.
 *
 * The site's navbar uses smart-nav: on "/" it scrolls to a section, otherwise
 * it routes to a page. Tests start from a non-home route so navbar links
 * trigger real navigation.
 */

const TOP_TOLERANCE = 5;
const RESTORE_TOLERANCE = 120;

async function getScrollY(page: Page) {
  return page.evaluate(
    () => window.scrollY || document.documentElement.scrollTop || 0,
  );
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((target) => {
    window.scrollTo({ top: target, left: 0, behavior: "auto" });
  }, y);
  await page.waitForTimeout(200);
}

test.describe("scroll behavior", () => {
  test("link click scrolls the next page to the top", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await scrollTo(page, 800);
    expect(await getScrollY(page)).toBeGreaterThan(200);

    await page.getByRole("link", { name: /^about$/i }).first().click();
    await page.waitForURL("**/about");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);

    expect(await getScrollY(page)).toBeLessThanOrEqual(TOP_TOLERANCE);
  });

  test("back restores previous scroll, forward returns to top", async ({
    page,
  }) => {
    await page.goto("/work");
    await page.waitForLoadState("networkidle");

    await scrollTo(page, 1400);
    const workScroll = await getScrollY(page);
    expect(workScroll).toBeGreaterThan(400);

    await page.getByRole("link", { name: /^services$/i }).first().click();
    await page.waitForURL("**/services");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    expect(await getScrollY(page)).toBeLessThanOrEqual(TOP_TOLERANCE);

    await page.goBack();
    await page.waitForURL("**/work");
    await page.waitForTimeout(500);
    const restored = await getScrollY(page);
    expect(Math.abs(restored - workScroll)).toBeLessThanOrEqual(
      RESTORE_TOLERANCE,
    );

    await page.goForward();
    await page.waitForURL("**/services");
    await page.waitForTimeout(500);
    expect(await getScrollY(page)).toBeLessThanOrEqual(TOP_TOLERANCE);
  });
});

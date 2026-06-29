import { test, expect } from "@playwright/test";

/**
 * Verifies global scroll behavior:
 *  1. Link clicks (forward navigation) scroll to the top of the new page.
 *  2. Browser back restores the previous scroll position.
 *  3. Browser forward returns the navigated-to page to the top.
 *
 * Lenis smooth-scroll runs on the page, so we read scroll offset via
 * `window.scrollY || document.documentElement.scrollTop` and allow a small
 * tolerance (<= 5px) to account for smooth-restore easing.
 */

const TOP_TOLERANCE = 5;
const RESTORE_TOLERANCE = 80;

async function getScrollY(page: import("@playwright/test").Page) {
  return page.evaluate(
    () => window.scrollY || document.documentElement.scrollTop || 0,
  );
}

async function scrollTo(page: import("@playwright/test").Page, y: number) {
  await page.evaluate((target) => {
    // Bypass Lenis smooth scroll for deterministic positioning in tests.
    window.scrollTo({ top: target, left: 0, behavior: "auto" });
  }, y);
  // Let Lenis / scroll listeners settle.
  await page.waitForTimeout(150);
}

test.describe("scroll behavior", () => {
  test("link click scrolls the next page to the top", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await scrollTo(page, 1200);
    expect(await getScrollY(page)).toBeGreaterThan(400);

    // Navbar "About" link.
    await page.getByRole("link", { name: /^about$/i }).first().click();
    await page.waitForURL("**/about");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);

    const y = await getScrollY(page);
    expect(y).toBeLessThanOrEqual(TOP_TOLERANCE);
  });

  test("back restores previous scroll, forward returns to top", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await scrollTo(page, 1500);
    const homeScroll = await getScrollY(page);
    expect(homeScroll).toBeGreaterThan(400);

    await page.getByRole("link", { name: /^services$/i }).first().click();
    await page.waitForURL("**/services");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);
    expect(await getScrollY(page)).toBeLessThanOrEqual(TOP_TOLERANCE);

    // Back → restore home scroll position.
    await page.goBack();
    await page.waitForURL((url) => url.pathname === "/");
    await page.waitForTimeout(400);
    const restored = await getScrollY(page);
    expect(Math.abs(restored - homeScroll)).toBeLessThanOrEqual(
      RESTORE_TOLERANCE,
    );

    // Forward → /services should be at the top again.
    await page.goForward();
    await page.waitForURL("**/services");
    await page.waitForTimeout(400);
    expect(await getScrollY(page)).toBeLessThanOrEqual(TOP_TOLERANCE);
  });
});

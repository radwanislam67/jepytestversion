import { chromium } from "@playwright/test";
const browser = await chromium.launch({ executablePath: "/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", m => console.log("[page]", m.type(), m.text()));
await page.goto("http://localhost:8080/contact");
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2500);
await page.screenshot({ path: "/tmp/browser/contact.png" });
const links = await page.getByRole("link", { name: /^about$/i }).all();
console.log("about links:", links.length);
for (const l of links) console.log(" -", await l.evaluate(el => ({tag:el.tagName, href:el.getAttribute('href'), text:el.textContent?.trim(), visible: el.offsetParent!==null, rect: el.getBoundingClientRect().toJSON()})));
const first = links[0];
if (first) {
  await first.scrollIntoViewIfNeeded();
  await first.click({ trial: false });
  await page.waitForTimeout(2000);
  console.log("url after click:", page.url());
}
await browser.close();

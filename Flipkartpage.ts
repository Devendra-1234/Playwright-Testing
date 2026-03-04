import { expect, Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────
// Helpers (No Login)
// ─────────────────────────────────────────────────────────────

export async function closeLoginPopupIfVisible(page: Page) {
  const closeByText = page.locator('button:has-text("✕")').first();
  const closeByClass = page.locator('button._2KpZ6l._2doB4z, button._2doB4z').first();

  if (await closeByText.isVisible().catch(() => false)) {
    await closeByText.click().catch(() => {});
    return;
  }

  if (await closeByClass.isVisible().catch(() => false)) {
    await closeByClass.click().catch(() => {});
  }
}

export async function openHome(page: Page) {
  await page.goto('https://www.flipkart.com/', { waitUntil: 'domcontentloaded' });
  await closeLoginPopupIfVisible(page);
}

export async function searchProduct(page: Page, query: string) {
  await openHome(page);

  const searchBox = page.locator('input[name="q"]').first();
  await expect(searchBox).toBeVisible({ timeout: 15000 });

  await searchBox.fill(query);
  await searchBox.press('Enter');

  // Better than only domcontentloaded (Flipkart loads async)
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  console.log(`✅ Searched for: "${query}"`);
}

export async function goToPage2(page: Page) {
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(800);

  const page2Button = page.getByRole('link', { name: '2', exact: true }).click();

  // await expect(page2Button).toBeVisible({ timeout: 15000 });

  // Wait for navigation triggered by click
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    // page2Button.click(),
  ]);

  await page.waitForTimeout(1200);
  console.log('✅ Navigated to Page 2 via pagination');
}

// export async function getAllProductTitles(page: Page): Promise<string[]> {
//   const titleLocator = page.locator(
//     'div[data-id] ._4rR01T, div[data-id] .s1Q9rs, div[data-id] .WKTcLC, a._1fQZEK div._4rR01T'
//   );

//   await titleLocator.first().waitFor({ timeout: 15000 });

//   const titles = (await titleLocator.allTextContents())
//     .map(t => t.trim())
//     .filter(Boolean);

//   console.log(`✅ Found ${titles.length} products on Page 2`);
//   titles.forEach((t, i) => console.log(`  [${i + 1}] ${t}`));

//   return titles;
// }

export async function clickFirstGreyTshirt(page: Page) {
  const productLinks = page.locator('a._1fQZEK, a.s1Q9rs, div[data-id] a').filter({
    hasText: /grey.*t[-\s]?shirt|t[-\s]?shirt.*grey/i,
  });

  const count = await productLinks.count();
  console.log(`✅ Found ${count} product(s) matching "Grey T-shirt"`);

  expect(count).toBeGreaterThan(0);

  // Better popup handling: wait on context page event too
  const context = page.context();

  const [newPage] = await Promise.all([
    context.waitForEvent('page').catch(() => null),
    productLinks.first().click(),
  ]);

  const productPage = newPage ?? page;

  await productPage.waitForLoadState('domcontentloaded');
  await productPage.waitForTimeout(1200);

  console.log('✅ Opened product detail page');
  return productPage;
}

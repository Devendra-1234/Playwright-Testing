import { test, expect, Page } from '@playwright/test';

import {
  searchProduct,
  goToPage2,
  // getAllProductTitles,
  clickFirstGreyTshirt,
  closeLoginPopupIfVisible,
} from '../Pages/Flipkartpage';


test.describe('Flipkart – Puma Grey T-Shirt Men (No Login)', () => {
  let contextPage: Page;   // page used for search/results
  let productPage: Page;   // final PDP page (could be popup)

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    contextPage = await context.newPage();

    // ✅ No login — only search
    await searchProduct(contextPage, 'Puma Grey T-Shirt Men');
    await goToPage2(contextPage);
    // await getAllProductTitles(contextPage);

    // Navigate to PDP (might open in popup/new tab)
    productPage = await clickFirstGreyTshirt(contextPage);

    // Close login popup if it appears on product page as well
    await closeLoginPopupIfVisible(productPage);

    // allow dynamic content to settle
    await productPage.waitForTimeout(2000);
  });

  test.afterAll(async () => {
    await contextPage.context().close();
  });

  // ──────────────────────────────────────────────────────────
  // TC1 – Size Chart
  // ──────────────────────────────────────────────────────────
  test('TC1 – Click Size Chart and print available sizes', async () => {
    const sizeChartTrigger = productPage
      .locator(
        'a:has-text("Size Chart"), span:has-text("Size Chart"), button:has-text("Size Chart"), [data-testid="size-chart"]'
      )
      .first();

    await expect(sizeChartTrigger).toBeVisible({ timeout: 15000 });
    await sizeChartTrigger.click();
    console.log('✅ Clicked on Size Chart');

    // Prefer dialog first; table might be inside it
    // const dialog = productPage.locator('[role="dialog"]').first();
    // await expect(dialog).toBeVisible({ timeout: 10000 });

    // If there is a table, print table contents; else print dialog text
    // const table = dialog.locator('table').first();

    // if (await table.count()) {
    //   const cells = table.locator('th, td');
    //   const all = (await cells.allTextContents()).map(s => s.trim()).filter(Boolean);

    //   console.log('📏 Size Chart (cells):');
    //   all.forEach((s, i) => console.log(`  [${i + 1}] ${s}`));
    //   expect(all.length).toBeGreaterThan(0);
    // } else {
    //   const text = (await dialog.innerText()).trim();
    //   console.log('📏 Size Chart (dialog text):\n', text);
    //   expect(text.length).toBeGreaterThan(0);
    // }

    // // Close modal if possible

    const closeBtn = productPage.getByRole('button', { name: 'Close size chart' });

    await expect(closeBtn).toBeVisible({ timeout: 10000 });
    await closeBtn.click();

  });

  // ──────────────────────────────────────────────────────────
  // TC2 – Share icon → Facebook
  // ──────────────────────────────────────────────────────────
  test('TC2 – Click Share icon and validate Facebook option appears', async () => {
    // Locate the share icon/button on PDP
    const shareIcon = productPage.locator(
      'svg[width="24"][height="24"][viewBox="0 0 24 24"]',
    ).first();

    await expect(shareIcon).toBeVisible({ timeout: 10000 });
    await shareIcon.click();
    console.log('✅ Clicked Share icon');

    // Validate Facebook icon / link appears in the share panel
    const facebookOption = productPage.locator(
      'a[href*="facebook"], img[alt*="Facebook" i], span:has-text("Facebook"), [aria-label*="Facebook" i]',
    ).first();

    await expect(facebookOption).toBeVisible({ timeout: 8000 });
    console.log('✅ TC2 PASSED – Facebook icon is visible in the Share panel');
    // Close share panel if possible
    await productPage.keyboard.press('Escape');
    await productPage.waitForTimeout(500);
  });

  // ──────────────────────────────────────────────────────────
  // TC3 – Pincode validation
  // ──────────────────────────────────────────────────────────
  test('TC3 – Enter pincode 444444 and validate out-of-stock error', async () => {
    const pincodeInput = productPage
      .locator(
        'input[placeholder*="Pincode" i], input[placeholder*="PIN" i], input[id*="pincode" i], input[name*="pincode" i]'
      )
      .first();

    await expect(pincodeInput).toBeVisible({ timeout: 15000 });
    await pincodeInput.fill('444444');
    console.log('✅ Entered pincode: 444444');

    const checkButton = productPage
      .locator('button:has-text("Check"), span:has-text("Check"), a:has-text("Check")')
      .first();

    await expect(checkButton).toBeVisible({ timeout: 10000 });
    await checkButton.click();
    console.log('✅ Clicked Check button');

    const errorMessage = productPage
      .locator(
        'text=/out of stock/i, text=/Currently out of stock.*444444/i, [class*="error"]:has-text("444444"), [class*="pincode"]:has-text("out of stock")'
      )
      .first();

    await expect(errorMessage).toBeVisible({ timeout: 15000 });

    const errorText = (await errorMessage.textContent())?.trim() || '';
    console.log(`✅ TC3 PASSED – Error: "${errorText}"`);

    expect(errorText.toLowerCase()).toContain('out of stock');
    expect(errorText).toContain('444444');
  });
});
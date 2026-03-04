
import { test, expect } from '@playwright/test'
import e from 'express';

test.describe('Demo Playwright Test Suite', () => {
    test('Login Demo Test', async ({ page }) => {
        await page.goto('https://demo.applitools.com/');
        // await page.pause();
        await page.getByRole('textbox', { name: 'Enter your username' }).fill('Devendra');
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Devendra');
        await page.getByRole('link', { name: 'Sign in' }).click();

    });
    test('Login Demo 2', async ({ page }) => {
        await page.pause();
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('banner').getByText('Ramana NRS').click();
        await page.getByRole('menuitem', { name: 'Logout' }).click();
    });

    test('Assertion Test', async ({ page }) => {
        await page.goto('https://kitchen.applitools.com/')
        await page.pause();
        await expect(page.getByRole('heading', { name: 'The Kitchen' })).toHaveCount(1);

        if (await page.$('text=The Kitchen')) {
            await page.getByRole('heading', { name: 'The Kitchen' }).click();
        }

    });
    test('HelloWorld!', async ({ page }) => {
        await page.goto('https://kitchen.applitools.com/')
        // await page.pause();

        await expect(page).toHaveTitle(/The Kitchen/);
        // await page.$('text = The Kitchen').toHaveCount(1);
    });

    test('IncognitoTab', async ({ browser }) => {
        // await page.pause();
        // Create a new incognito browser context
        const context = await browser.newContext();
        // Create a new page inside context.
        const page = await context.newPage();
        await page.pause();

        await page.goto('https://example.com');
        // Dispose context once it's no longer needed.
        await context.close();
    });

    test('LoginPage', async ({ page }) => {

        await page.goto('https://multistepform.netlify.app');
        await page.pause();
        await page.locator('#undefined-EnterFirstName-undefined-11619').click();
        await page.locator('#undefined-EnterFirstName-undefined-11619').fill('Deva');
        await page.locator('#undefined-EnterLastname-undefined-30768').click();
        await page.locator('#undefined-EnterLastname-undefined-30768').fill(K);
        await page.locator('#undefined-EnterEmail-undefined-40154').click();
        await page.locator('#undefined-EnterEmail-undefined-40154').fill('devak@gmail.com')

    })
    test('test', async ({ page }) => {
        await page.goto('https://multistepform.netlify.app/');
        await page.pause();
        await page.locator('input[floatinglabeltext="FirstName"]').fill('Devendra');
        await page.locator('input[floatinglabeltext="LastName"]').fill('k');
        await page.locator('input[floatinglabeltext="Email"]').fill('dev@gmail.com');
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.locator('input[floatinglabeltext="Occupation"]').fill('Engineer');
        await page.locator('input[floatinglabeltext="City"]').fill('Bangalore');
        await page.locator('input[floatinglabeltext="Bio"]').fill('Data');
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.getByRole('button', { name: 'Confirm & Continue' }).click();
        await expect(page.getByRole('heading', { name: 'Thankyou for your Submission' })).toHaveCount(1);
        await page.screenshot({ path: 'screenshot.png' });
    });
    test.only('test1', async ({ page }) => {
        await page.goto('https://www.flipkart.com/');
        // await page.locator('form').filter({ hasText: 'Enter Email/Mobile numberBy' }).getByRole('textbox').click();
        await page.getByRole('button', { name: '✕' }).click();
        await page.getByRole('textbox', { name: 'Search for Products, Brands' }).click();
        await page.getByRole('textbox', { name: 'Search for Products, Brands' }).fill('Puma, Gray T-shirt Men');
        // await page.getByRole('textbox', { name: 'Search for Products, Brands' }).press('Enter');
        // await page.getByRole('textbox', { name: 'Search for Products, Brands' }).click();
        await page.getByRole('textbox', { name: 'Search for Products, Brands' }).press('Enter');
        await page.getByRole('link', { name: '2', exact: true }).click();
        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
        const page1 = await page1Promise;
        const sizeChart = await page1.getByRole('link', { name: 'Size Chart' }).click();
        
        // await page1.locator('[//button[@class='iEcjP2']').click();
        // await page.pause();
        await page1.getByRole('link').first().click();
        await page1.locator('._1psv1zeb9._1o6mltljo._7dzyg26').click();
        // const page2Promise = page1.waitForEvent('popup');
        // await page1.locator('div:nth-child(3) > .ntqCYD > .iSAepO').click();
        // const page2 = await page2Promise;
        await expect(page1.locator('div:nth-child(3) > .ntqCYD > .iSAepO')).toHaveCount(1);
        await page.screenshot({ path: 'screenshot.png' });
        // await page1.locator('a').filter({ hasText: 'Location not setSelect' }).click();
        // await page1.goto('https://www.flipkart.com/puma-printed-men-round-neck-grey-t-shirt/p/itm9c87a45f6bb7f?pid=TSHG97ZFGDJGFTYJ&lid=LSTTSHG97ZFGDJGFTYJGNN6KB&marketplace=FLIPKART&q=Puma%2C+Gray+T-shirt+Men&store=clo%2Fash%2Fank%2Fedy&srno=s_2_41&otracker=search&otracker1=search&fm=Search&iid=ec4aa613-88bf-4d93-8085-741414ddffc1.TSHG97ZFGDJGFTYJ.SEARCH&ppt=sp&ppn=sp&ssid=oeq32m3n400000001772557893297&qH=cce07d0ce482e361&ov_redirect=true');
        // await page1.getByRole('textbox', { name: 'Search by area, street name,' }).click();
        // await page1.getByRole('textbox', { name: 'Search by area, street name,' }).fill('444444');
        // await page1.getByText('गदरा रोड BARMER Rajasthan').click();
        // await page1.getByRole('button', { name: 'Confirm' }).click();
    });
});
const playwright = require('playwright');

async function main() {
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://finance.yahoo.com/world-indices');
    const market = await page.$eval('#YDC-Lead-Stack-Composite', headerElm => {
        const data = [];
        const listElms = headerElm.getElementsByTagName('li');
        for (const elm of listElms) {
            data.push(elm.innerText.split('\n'));
        }
        return data;
    })

    console.log('Market Composites--->>>>', market);
    await page.waitForTimeout(1000);
    await browser.close();
}

async function mostActive() {
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://finance.yahoo.com/most-active?count=100');
    const mostActive = await page.$eval('#fin-scr-res-table tbody', tableBody => {
        let all = [];
        for (let i = 0, row; row = tableBody.rows[i]; i++) {
            let stock = [];
            for (let j = 0, col; col = row.cells[j]; j++) {
                stock.push(row.cells[j].innerText);
            }
            all.push(stock);
        }
        return all;
    })

    console.log('Most Active -->', mostActive);
    await page.waitForTimeout(30000);
    await browser.close();
}

async function allLists() {
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://finance.yahoo.com');
    const allList = await page.$$('li', selected => {
        let data = [];
        for (const item of selected) {
            data.push(item.innerText);
        }
        return data;
    });

    console.log('Most Active', allList);
}

const axios = require('axios');
const fs = require('fs');
const { pathToFileURL } = require('url');

async function saveImages() {
    const browser = await playwright.chromium.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://www.scrapingbee.com/');
    const url = await page.$eval('div.-ml-20 img', img => img.src);
    const response = await axios.get(url);
    fs.writeFileSync('scrappy.svg', response.data);
    await browser.close();
}

const options = {
    path: 'clipped_screenshot.png',
    fullPage: false,
    clip: {
        x: 5,
        y: 60,
        width: 240,
        height: 40,
    }
}

async function takeScreenShots() {
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.setViewportSize({
        width: 1280,
        height: 800,
    })
    await page.goto('https://finance.yahoo.com');
    // await page.screenshot({ path: 'my_screenshot.png' });
    await page.screenshot(options);
    await browser.close();
}

async function xpathPractice() {
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://stackoverflow.blog/');
    const xpathData = await page.$eval('xpath=//html/body/div/header/nav', navElm => {
        let refs = [];
        let aTags = navElm.getElementsByTagName('a');
        for (const item of aTags) {
            refs.push(item.href);
        }
        return refs
    });

    console.log('StackOverflow Links', xpathData);
    await page.waitForTimeout(5000);
    await browser.close();
}

async function formExample() {
    const browser = await playwright.chromium.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.goto('https://github.com/login');

    // interact with login form
    await page.fill('input[name="login"]', "MyUserName");
    await page.fill('input[name="password"]', "Secretpass");
    await page.click('input[type="submit"]');
    await page.waitForTimeout(5000)
    await browser.close()
}

// formExample();
const playwright = require('playwright');

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto('https://www.globalsqa.com/demo-site/accordion-and-tabs/');

    const elements = await page.$eval('ul.resp-tabs-list', async (ul) => {
        const data = [];
        const tabs = ul.getElementsByTagName('li')

        const accordionBody = ul.nextElementSibling
        const h2s = accordionBody.querySelectorAll('h2')

        for (const tab of tabs) {
            const currentTab = tab.textContent
            tab.click()

            for (const h2 of h2s) {
                if (h2.textContent === tab.textContent) {
                    const accordionList = h2.nextElementSibling.querySelector('h3')
                    data.push(accordionList)
                }
            }
        }
        return data
    })
    await browser.close();
    console.log(elements);
}

main();
const playwright = require('playwright');

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.globalsqa.com/demo-site/accordion-and-tabs/');

    const tabList = page.locator(`//ul[contains(@class, 'resp-tabs-list')]/li`)
    const tabCount = await tabList.count()

    await page.waitForTimeout(500)

    for (let i = (tabCount - 1); i >= 0; i--) {
        const tab = tabList.nth(i)
        await tab.click()

        tabTitle = await tab.textContent();

        const iframe = page.frameLocator(`//div[@rel-title="${tabTitle}"]//iframe[contains(@class, 'demo-frame')]`)
        const accordionContainer = iframe.locator(`//div[@id='accordion']`).first()
        await accordionContainer.waitFor({ state: 'attached' })
        const accordions = accordionContainer.locator('//h3')
        const accordionCount = await accordions.count()

        for (let j = (accordionCount - 1); j >= 0; j--) {
            await accordions.nth(j).click()

            await page.waitForTimeout(500)
        }

    }
    await browser.close();
}

main();
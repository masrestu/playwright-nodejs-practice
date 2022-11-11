const playwright = require('playwright')

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/select-elements/')

    const tabList = page.getByRole(`tab`)
    const tabCount = await tabList.count()

    for (let tabIndex = 0; tabIndex < tabCount; tabIndex++) {
        const tab = tabList.nth(tabIndex)
        tabTitle = await tab.textContent()

        await tab.click()
        const iframe = page.frameLocator(`//div[@rel-title='${tabTitle}']//iframe[contains(@class, 'demo-frame')]`)

        const optionHeader = iframe.locator(`//ol`)
        await optionHeader.first().waitFor({ state: 'attached' })

        const optionList = optionHeader.locator(`//li`)
        const optCount = await optionList.count()
        const randomTotal = Math.floor(Math.random() * optCount)

        const selectedOpt = []
        while (selectedOpt.length < randomTotal) {
            const randIndex = Math.floor(Math.random() * optCount)
            const opt = await optionList.nth(randIndex).textContent()
            console.log(opt)
            if (selectedOpt.indexOf(opt) === -1) {
                selectedOpt.push(opt)
                await optionList.nth(randIndex).click({ modifiers: ['Control'] })
                await page.waitForTimeout(1000)
            }
        }
    }

    await browser.close()
}

main()
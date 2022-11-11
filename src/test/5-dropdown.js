const playwright = require('playwright')

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/select-dropdown-menu/')

    const selectField = page.locator(`//select`)

    const optValue = selectField.locator(`//option`)
    const optCount = await optValue.count()
    const optList = []
    for (let o = 0; o < optCount; o++) {
        const opt = await optValue.nth(o).getAttribute('value')
        optList.push(opt)
    }

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * optCount)
        const selectedValue = optList[randomIndex]

        selectField.selectOption(selectedValue)
        console.log(selectedValue);

        await page.waitForTimeout(1000)
    }

    await browser.close()
}

main()
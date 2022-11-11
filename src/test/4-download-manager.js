const playwright = require('playwright')

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/progress-bar/#Download%20Manager')

    const iframe = page.frameLocator(`//div[@rel-title='Download Manager']//iframe[contains(@class, 'demo-frame')]`)
    const btnDownload = iframe.locator(`text=Start Download`)
    await btnDownload.click()
    await iframe.getByRole('dialog').getByRole('button', { name: 'Close' }).click({
        delay: 2000
    });

    await page.waitForTimeout(5000)
    await browser.close()
}

main()
const playwright = require('playwright')

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')

    const tabList = page.getByRole(`tab`)
    const tabCount = await tabList.count()

    for (let tabIndex = 0; tabIndex < tabCount; tabIndex++) {
        const tab = tabList.nth(tabIndex)
        tabTitle = await tab.textContent()
        await tab.click()

        const iframe = page.frameLocator(`//div[@rel-title='${tabTitle}']//iframe[contains(@class, 'demo-frame')]`)

        if (tabIndex === 0) {
            const gallery = iframe.locator(`//ul[contains(@id, 'gallery')]`)
            const trash = iframe.locator(`//div[contains(@id, 'trash')]`)

            const galleryItem = gallery.locator(`//li[contains(@class, 'ui-draggable-handle')]`)
            await galleryItem.first().waitFor({ state: 'attached' })
            const galleryItemCount = await galleryItem.count()

            for (let itemIndex = 0; itemIndex < galleryItemCount; itemIndex++) {
                const item = galleryItem.first()

                await item.dragTo(trash)
                await page.waitForTimeout(1000)
            }

            const trashItem = trash.locator(`//li[contains(@class, 'ui-draggable-handle')]`)
            for (let itemIndex = 0; itemIndex < galleryItemCount; itemIndex++) {
                const item = trashItem.first()

                await item.dragTo(gallery)
                await page.waitForTimeout(1000)
            }
        }
        await page.waitForTimeout(2000)
    }

    await browser.close()
}

main()
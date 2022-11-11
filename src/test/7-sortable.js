const playwright = require('playwright')

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/sorting/')

    const tabList = page.getByRole(`tab`)
    const tabCount = await tabList.count()

    for (let tabIndex = 0; tabIndex < tabCount; tabIndex++) {
        const tab = tabList.nth(tabIndex)
        tabTitle = await tab.textContent()
        await tab.click()
        await page.waitForTimeout(2000)
        const iframe = page.frameLocator(`//div[@rel-title='${tabTitle}']//iframe[contains(@class, 'demo-frame')]`)

        if (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) {
            const xpaths = [`//li[contains(@class, 'ui-state-default')]`]
            if (tabIndex === 1) xpaths.push(`//li[contains(@class, 'ui-state-highlight')]`)

            // preparing sources and targets
            const sortables = []
            const contents = []
            const counts = []
            const targetPos = []
            for (const [index, xpath] of xpaths.entries()) {
                const item = iframe.locator(xpath)
                await item.first().waitFor({ state: 'attached' })

                sortables[index] = item
                contents[index] = await sortables[index].allTextContents()
                contents[index].reverse()
                counts[index] = await sortables[index].count()

                const posInit = []
                for (let posIndex = 0; posIndex < counts[index]; posIndex++) {
                    const bound = await sortables[index].nth(posIndex).boundingBox()
                    posInit.push({ x: bound.x, y: bound.y, width: bound.width, height: bound.height })
                }
                const targetIndex = (tabIndex === 1) ? +!index : index
                targetPos[targetIndex] = posInit
            }

            // swap process
            for (const [index, contentItem] of contents.entries()) {
                for (const [idx, content] of contentItem.entries()) {
                    // get item position
                    const initBound = await sortables[index].filter({ hasText: `'${content}'` }).boundingBox()
                    const xPos = initBound.x + (initBound.width / 2)
                    const yPos = initBound.y + (initBound.height / 2)

                    // move mouse to item and ready to drag
                    console.log('\nbefore-after', index, content);
                    console.log(xPos, yPos)
                    await page.mouse.move(xPos, yPos)
                    await page.mouse.down()

                    // get target position
                    const targetBound = targetPos[index][idx]
                    const xTarget = targetBound.x + (targetBound.width / 2) - ((tabIndex === 1) ? 0 : 5)
                    const yTarget = targetBound.y + (tabIndex === 1 ? 0 : (targetBound.height / 2)) - ((tabIndex === 1) ? 0 : 5)
                    console.log(xTarget, yTarget);

                    // move mouse to target and finish drag
                    await page.mouse.move(xTarget, yTarget, {
                        steps: 10
                    })
                    await page.mouse.up()
                }
            }
        }

        if (tabIndex === 0) {
            const headers = iframe.locator(`//div[contains(@class, 'portlet-header')]`)
            await headers.first().waitFor({ state: 'attached' })

            const elementToSwap = ['Shopping', 'Feed']

            // save initial position of each item
            const initialPos = []
            for (const element of elementToSwap) {
                const initialBound = await headers.getByText(element).boundingBox()
                initialPos.push({ x: initialBound.x, y: initialBound.y, width: initialBound.width, height: initialBound.height })
            }
            initialPos.reverse();

            // swap process
            for (let elemIndex = 0; elemIndex < elementToSwap.length; elemIndex++) {
                const element = elementToSwap[elemIndex];

                const elementBound = await headers.getByText(element).first().boundingBox()
                const elemCenterX = elementBound.width / 2
                const elemCenterY = elementBound.height / 2
                const posX = elementBound.x + elemCenterX
                const posY = elementBound.y + elemCenterY

                // ready to drag
                await page.mouse.move(posX, posY)
                await page.mouse.down()

                const targetBound = initialPos[elemIndex]
                const targetCenterX = targetBound.width / 2
                const targetX = targetBound.x + targetCenterX
                const targetY = targetBound.y
                console.log(targetX, targetY);

                await page.mouse.move(targetX, targetY, {
                    steps: 15
                })
                await page.mouse.up()

            }
        }

        await page.waitForTimeout(2000)
    }

    await browser.close()
}

main()
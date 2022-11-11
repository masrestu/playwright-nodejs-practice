const playwright = require('playwright')

const getValue = (val) => {
    val = val.split(' ')
    val = val[1]
    val = val.slice(0, -2)

    return val
}

const getPrice = (val, index) => {
    val = val.split(' - ')
    val = val[index]
    val = val.slice(1)

    return val
}

const selectRandom = (max = 100, min = 0) => {
    const tolerance = max * 0.1
    max -= tolerance
    const rand = Math.floor(Math.random() * (max - min) + min) + tolerance
    return rand
}

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/sliders/')

    const tabList = page.locator(`//li[contains(@class, 'resp-tab-item')]`)
    const tabCount = await tabList.count()

    for (let tabIndex = 0; tabIndex < tabCount; tabIndex++) {
        const selectedTab = tabList.nth(tabIndex)
        await selectedTab.click()
        const tabTitle = await selectedTab.textContent()
        console.log(tabTitle)

        const iframe = page.frameLocator(`//div[@rel-title='${tabTitle}']//iframe[contains(@class, 'demo-frame')]`)
        const sliders = iframe.locator(`//div[contains(@class, 'ui-slider')]/span`)
        await sliders.first().waitFor({ state: 'attached' })
        const slidersCount = await sliders.count()

        if (tabIndex === 0) {
            for (let sliderIndex = 0; sliderIndex < slidersCount; sliderIndex++) {
                const sliderSpan = sliders.nth(sliderIndex)
                let currentValue = getValue(await sliderSpan.getAttribute('style'))
                const targetValue = selectRandom(80)
                const increasing = (currentValue < targetValue)
                let isCompleted = false

                while (!isCompleted) {
                    if (increasing) {
                        await sliderSpan.press('ArrowUp')
                    } else {
                        await sliderSpan.press('ArrowDown')
                    }
                    currentValue = getValue(await sliderSpan.getAttribute('style'))

                    const finished = (increasing) ? (currentValue > targetValue) : (currentValue < targetValue)
                    if (finished) {
                        isCompleted = true
                    }
                }
            }
        }

        if (tabIndex === 1) {
            const currentAmt = iframe.locator(`//input[contains(@id, 'amount')]`)
            const maxValue = getPrice(await currentAmt.inputValue(), 1)
            const minTarget = selectRandom(parseInt(maxValue), 0)
            const maxTarget = selectRandom(500, minTarget)
            const allTarget = [minTarget, maxTarget]
            for (let sliderIndex = 0; sliderIndex < slidersCount; sliderIndex++) {
                const sliderSpan = sliders.nth(sliderIndex)
                let currentValue = getPrice(await currentAmt.inputValue(), sliderIndex)
                const targetValue = allTarget[sliderIndex]
                const increasing = (currentValue < targetValue)
                let isCompleted = false

                while (!isCompleted) {
                    if (increasing) {
                        await sliderSpan.press('ArrowUp')
                    } else {
                        await sliderSpan.press('ArrowDown')
                    }
                    currentValue = getPrice(await currentAmt.inputValue(), sliderIndex)

                    const finished = (increasing) ? (currentValue > targetValue) : (currentValue < targetValue)
                    if (finished) {
                        isCompleted = true
                    }
                }
            }
        }

        if (tabIndex === 2) {
            const currentAmt = iframe.locator(`//input[contains(@id, 'amount')]`)
            const targetValue = selectRandom(500)
            const allTarget = [targetValue]
            for (let sliderIndex = 0; sliderIndex < slidersCount; sliderIndex++) {
                const sliderSpan = sliders.nth(sliderIndex)
                let currentValue = getPrice(await currentAmt.inputValue(), sliderIndex)
                const targetValue = allTarget[sliderIndex]
                const increasing = (currentValue < targetValue)
                let isCompleted = false

                while (!isCompleted) {
                    if (increasing) {
                        await sliderSpan.press('ArrowUp')
                    } else {
                        await sliderSpan.press('ArrowDown')
                    }
                    currentValue = getPrice(await currentAmt.inputValue(), sliderIndex)

                    const finished = (increasing) ? (currentValue > targetValue) : (currentValue < targetValue)
                    if (finished) {
                        isCompleted = true
                    }
                }
            }
        }

        await page.waitForTimeout(1000)
    }
    await browser.close()
}

main()
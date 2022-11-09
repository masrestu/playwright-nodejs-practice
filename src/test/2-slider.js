const playwright = require('playwright');

const getValue = (val) => {
    val = val.split(' ')
    val = val[1]
    val = val.slice(0, -2)
    val = parseFloat(val)

    return val
}

const selectRandom = (max = 80) => {
    const rand = Math.floor(Math.random() * max) + 10;
    return rand
}

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.globalsqa.com/demo-site/sliders/');

    const iframe = page.frameLocator(`//iframe[contains(@class, 'demo-frame')]`).first()

    for (let x = 0; x < 30; x++) {
        const colors = ['red', 'green', 'blue']

        for (const color of colors) {
            const sliderDiv = iframe.locator(`//div[contains(@id, '${color}')]`)
            const sliderSpan = sliderDiv.locator(`//span`)
            const counter = await sliderSpan.count()

            let currentValue = getValue(await sliderSpan.getAttribute('style'))
            const targetValue = selectRandom(80)
            const increasing = (currentValue < targetValue)
            let isCompleted = false

            let spanBound = await sliderSpan.boundingBox()
            let startingPositionX = spanBound.x + spanBound.width / 2
            let startingPositionY = spanBound.y + spanBound.height / 2
            await page.mouse.move(startingPositionX, startingPositionY)
            await page.mouse.down()
            console.log(currentValue, targetValue, color);

            let adjustmentValue = 15
            while (!isCompleted) {
                const adjustment = adjustmentValue * (increasing ? 1 : -1)
                await page.mouse.move(startingPositionX + adjustment, startingPositionY)
                currentValue = getValue(await sliderSpan.getAttribute('style'))

                const finished = (increasing) ? (currentValue > targetValue) : (currentValue < targetValue)
                if (finished) {
                    isCompleted = true
                    await page.mouse.up()
                } else {
                    spanBound = await sliderSpan.boundingBox()
                    startingPositionX = spanBound.x + spanBound.width / 2
                    startingPositionY = spanBound.y + spanBound.height / 2
                }
            }
        }
    }

    await page.locator('//div[@class="content_bgr"]').click({
        delay: 2000
    })
    await browser.close();
}

main();
const playwright = require('playwright')

const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/datepicker/')

    const tabList = page.getByRole(`tab`)
    const tabCount = await tabList.count()

    for (let tabIndex = 0; tabIndex < tabCount; tabIndex++) {
        const tab = tabList.nth(tabIndex)
        tabTitle = await tab.textContent()
        await tab.click()

        const iframe = page.frameLocator(`//div[@rel-title='${tabTitle}']//iframe[contains(@class, 'demo-frame')]`)

        if (tabIndex == 2) {
            const datepickerTrigger = iframe.locator(`//*[contains(@class, 'ui-datepicker-trigger')]`)
            await datepickerTrigger.waitFor({ state: 'attached' })
            await datepickerTrigger.click()

            const selectedYear = iframe.locator(`//*[@class='ui-datepicker-year']`)
            const selectedMonth = iframe.locator(`//*[@class='ui-datepicker-month']`)

            const prevBtn = iframe.locator(`//a[@title='Prev']`)
            let currentYear = await selectedYear.textContent()
            let currentMonth = await selectedMonth.textContent()

            const expectedYear = '2021'
            const expectedMonth = 'June'
            const expectedDay = '15'

            while (!(expectedYear === currentYear && expectedMonth === currentMonth)) {
                await prevBtn.click()
                currentYear = await selectedYear.textContent()
                currentMonth = await selectedMonth.textContent()
            }

            const calendar = iframe.locator(`//a[@class='ui-state-default']`).filter({
                hasText: `'${expectedDay}'`
            })
            await calendar.click()
        }

        if (tabIndex == 1) {
            const datepicker = iframe.locator(`//*[@id='datepicker']`)
            await datepicker.waitFor({ state: 'attached' })
            await datepicker.click()

            const expectedYear = 1994
            const expectedMonth = 'Jan'
            const expectedDay = '31'

            // selecting year
            const selectedYear = iframe.locator(`//select[contains(@class, 'ui-datepicker-year')]`)
            await selectedYear.waitFor({ state: `attached` })

            const optionYear = selectedYear.locator(`//option`)
            console.log(await optionYear.count());
            let minYear = optionYear.first()
            let maxYear = optionYear.last()
            let minYearValue = parseInt(await minYear.textContent())
            let maxYearValue = parseInt(await maxYear.textContent())

            let position = (expectedYear < minYearValue) ? 'below' : 'current'
            position = (expectedYear > maxYearValue) ? 'above' : position
            // console.log(position, expectedYear, minYearValue, maxYearValue, typeof expectedYear, typeof minYearValue, typeof maxYearValue);
            while (position !== 'current') {
                if (position === 'below') {
                    minYearValue = parseInt(await minYear.textContent())
                    await selectedYear.selectOption(minYearValue.toString())
                } else {
                    maxYearValue = parseInt(await maxYear.textContent())
                    await selectedYear.selectOption(maxYearValue.toString())
                }

                position = (expectedYear < minYearValue) ? 'below' : 'current'
                position = (expectedYear > maxYearValue) ? 'above' : position
                // console.log(position, expectedYear, minYearValue, maxYearValue, typeof expectedYear, typeof minYearValue, typeof maxYearValue);
            }

            await selectedYear.selectOption(expectedYear.toString())

            // selecting month
            const selectedMonth = iframe.locator(`//select[contains(@class, 'ui-datepicker-month')]`)
            await selectedMonth.waitFor({ state: `attached` })
            await selectedMonth.selectOption({ label: expectedMonth })

            const calendar = iframe.locator(`//a[@class='ui-state-default']`).filter({
                hasText: `'${expectedDay}'`
            })
            await calendar.click()
        }

        if (tabIndex == 0) {
            const datepicker = iframe.locator(`//*[@id='datepicker']`)
            await datepicker.waitFor({ state: 'attached' })
            await datepicker.click()

            const selectedYear = iframe.locator(`//*[@class='ui-datepicker-year']`)
            const selectedMonth = iframe.locator(`//*[@class='ui-datepicker-month']`)
            await selectedYear.waitFor({ state: `attached` })

            const prevBtn = iframe.locator(`//a[@title='Prev']`)
            let currentYear = await selectedYear.textContent()
            let currentMonth = await selectedMonth.textContent()

            const expectedYear = '2021'
            const expectedMonth = 'June'
            const expectedDay = '15'

            while (!(expectedYear === currentYear && expectedMonth === currentMonth)) {
                await prevBtn.click()
                currentYear = await selectedYear.textContent()
                currentMonth = await selectedMonth.textContent()
            }

            const calendar = iframe.locator(`//a[@class='ui-state-default']`).filter({
                hasText: `'${expectedDay}'`
            })
            await calendar.click()
        }
        await page.waitForTimeout(2000)
    }

    await browser.close()
}

main()
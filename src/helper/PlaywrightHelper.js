const playwright = require('playwright');

class PlaywrightHelper {
    constructor() {
        this.timeout = 300000
        this.browser = null
        this.page = null
    }

    async open(url) {
        try {
            if (!this.browser) {
                this.browser = await playwright.chromium.launch({
                    headless: false
                })

                this.page = await this.browser.newPage()
            }
            await this.page.goto(url)
        } catch (error) {
            console.log(error)
        }
    }

    async close() {
        this.browser.close()
    }

    async delayClose(ms = this.timeout) {
        const s = ms * 1000
        await this.page.waitForTimeout(s)
        await this.close()
    }
}

module.exports = PlaywrightHelper
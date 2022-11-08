const PlaywrightHelper = require('./PlaywrightHelper')

class QuoteHelper extends PlaywrightHelper {
    constructor() {
        super()
        this.url = 'http://quotes.toscrape.com/search.aspx'
    }

    async getData() {
        try {
            await this.open(this.url)
            await this.selectList('#author')
            await this.selectList('#tag')
            await this.page.locator('xpath=//input[@name="submit_button"]').click();

            const elmContent = await this.page.waitForSelector('xpath=//span[@class="content"]')
            const valContent = await elmContent.textContent()
            const elmAuthor = await this.page.waitForSelector('xpath=//span[@class="author"]')
            const valAuthor = await elmAuthor.textContent()
            const elmTag = await this.page.waitForSelector('xpath=//span[@class="tag"]')
            const valTag = await elmTag.textContent()

            return {
                content: valContent,
                author: valAuthor,
                tag: valTag,
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.delayClose(5)
        }
    }

    async selectList(selector) {
        const list = await this.page.$eval(selector, elm => {
            let result = []
            for (const e of elm) {
                const val = e.getAttribute('value')
                if (val) result.push(val)
            }
            return result
        })

        const option = await this.selectRandom(list)
        console.log(option);
        await this.page.locator(selector).selectOption(option);
    }

    async selectRandom(data, n = 1) {
        const rand = Math.floor(Math.random() * data.length);
        return data[rand]
    }
}

module.exports = QuoteHelper
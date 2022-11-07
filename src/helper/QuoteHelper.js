const PlaywrightHelper = require('./PlaywrightHelper')

class QuoteHelper extends PlaywrightHelper {
    constructor() {
        super()
        this.url = 'http://quotes.toscrape.com/search.aspx'
    }

    async getData() {
        try {
            await this.open(this.url)

            const author_xpath = '#author'
            await this.page.waitForSelector(author_xpath);
            const listAuthor = await this.page.$eval(author_xpath, author => {
                let result = []
                for (const a of author) {
                    result.push(a.getAttribute('value'))
                }
                return result
            })
            console.log(listAuthor)

            return listAuthor
        } catch (error) {
            console.log(error)
        } finally {
            this.delayClose(5)
        }
    }
}

module.exports = QuoteHelper
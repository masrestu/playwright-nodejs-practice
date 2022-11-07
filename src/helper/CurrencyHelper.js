const PlaywrightHelper = require('./PlaywrightHelper')

class CurrencyHelper extends PlaywrightHelper {
    constructor() {
        super()
        this.url = 'https://finance.yahoo.com/currencies'
    }

    async getData() {
        try {
            await this.open(this.url)

            const tableHeader = await this.page.$eval('table thead', tableHead => {
                let allHeader = [];
                for (let i = 0, row; row = tableHead.rows[i]; i++) {
                    let currencies = [];
                    for (let j = 0, col; col = row.cells[j]; j++) {
                        currencies.push(row.cells[j].innerText);
                    }
                    currencies.splice(-2, 2)
                    allHeader.push(currencies);
                }
                return allHeader;
            })

            const tableDetail = await this.page.$eval('table tbody', tableBody => {
                let allDetail = [];
                for (let i = 0, row; row = tableBody.rows[i]; i++) {
                    let currencies = [];
                    for (let j = 0, col; col = row.cells[j]; j++) {
                        currencies.push(row.cells[j].innerText);
                    }
                    currencies.splice(-2, 2)
                    allDetail.push(currencies);
                }
                return allDetail;
            })

            return { tableHeader, tableDetail }
        } catch (error) {
            console.log(error)
        } finally {
            this.close()
        }
    }
}

module.exports = CurrencyHelper
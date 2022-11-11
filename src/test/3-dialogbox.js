const playwright = require('playwright')
const { faker } = require('@faker-js/faker/locale/id_ID');


const main = async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://www.globalsqa.com/demo-site/dialog-boxes/#Form')

    const iframe = page.frameLocator(`//div[@rel-title='Form']//iframe[contains(@class, 'demo-frame')]`).first()
    const buttonCreate = iframe.locator(`//button[contains(@id,'create-user')]`)
    await buttonCreate.waitFor({ state: 'attached' })

    for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(5000)

        await buttonCreate.click()

        // select form
        const form = iframe.locator(`//form`)
        await form.waitFor({ state: 'attached' })

        const nameInput = form.locator(`//input[contains(@id, 'name')]`)
        const nameRandom = faker.name.firstName()
        await nameInput.fill(nameRandom)

        const emailInput = form.locator(`//input[contains(@id, 'email')]`)
        const emailRandom = faker.internet.email()
        await emailInput.fill(emailRandom)

        const passwordInput = form.locator(`//input[contains(@id, 'password')]`)
        await passwordInput.fill('12345678')

        await iframe.getByRole('dialog').locator('button', { hasText: 'Create an account' }).click();
    }

    await browser.close()
}

main()
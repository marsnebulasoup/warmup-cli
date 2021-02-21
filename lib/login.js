const { Builder, By, Key, until } = require('selenium-webdriver');
const { Progress } =  require('./progress')
const chalk = require('chalk');

module.exports = {
    Login: class {
        constructor(driver, email, password, url) {
            this.driver = driver;
            this.email = email;
            this.password = password;
            this.url = url;
        }

        async login() {
            let driver = this.driver // MAYBE REMOVING THIS WOULD HELP...?
            // let spinner = new Progress().spinner('Logging in...');
            // spinner.start();
            try {
                // console.log('Logging in...')
                await driver.get(this.url)

                await driver.findElement(By.id('Username')).sendKeys(this.email)
                await driver.findElement(By.id('Password')).sendKeys(this.password)
                await driver.findElement(By.xpath('//*[@id="login-form"]/div[2]/div')).click()
                await driver.findElement(By.xpath('//*[@id="login-form"]/div[2]/input')).click()
                // spinner.stop()
                // console.log('\nSuccessfully logged in.')
                // throw new Error('THIS IS A FAKE ERROR GENERATED IN login.js TO TEST THE ERROR HANDLING OF THIS PROGRAM.')
                // console.log('Done logging in...')
                return true
            }
            catch (err) {
                // spinner.stop()
                console.log(chalk.red.bold('\nLOGIN FAILED.\n'))
                console.error(err)
                driver.close()
                return false
            }
        }
    }
}

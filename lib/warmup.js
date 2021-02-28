const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Progress } = require('./progress.js');
const { Bus } = require('./bus');
const files = require('./files');
const { Login } = require('./login');
const chalk = require('chalk');

require('chromedriver');
class Driver {
  constructor(headless = false, browser = "chrome") {
    let driver = new Builder()
      .forBrowser(browser)
      .setChromeOptions(headless ? new chrome.Options().addArguments('--headless') : null)
      .build()
    return driver
  }
}

class Warmup {
  constructor(driver, urls, id = Math.floor(Math.random() * Math.floor(1000000)), login = false) {
    this.driver = driver;
    this.urls = urls;
    this.id = id.toString()
    this.login = login;
  }
  async open() {
    let progress_bar = new Progress(30, this.urls.length);
    if (this.login.login) {
      Bus.$emit(
        'progress-bar-update',
        {
          name: this.id,
          bar: progress_bar.line(
            0,
            "",
            this.id.length > 6 ? this.id : "",
            "Logging in..." // logging_in = true
          )
        }
      )
      let login = new Login(this.driver, this.login.email, this.login.password, this.login.url)
      login = await login.login();
      Bus.$emit(
        'progress-bar-update',
        {
          name: this.id,
          bar: progress_bar.line(
            0,
            "",
            this.id.length > 6 ? this.id : "",
            login ? "Successfully logged in." : "Logging in failed; aborting."
          )
        }
      )
    }
    // console.log('Fetching URLs for node #' + this.id)
    for (let index = 0; index < this.urls.length; index++) {
      let url = this.urls[index];
      // console.log('#' + this.id + ' | Currently on ' + url)
      try {
        await this.driver.get(url)
      }
      catch (err) {
        console.log('THERE WAS AN ERROR IN WARMUP.JS')
        console.log('This is the driver obj:')
        console.log(this.driver)
        console.error(err)
      }
      Bus.$emit(
        'progress-bar-update',
        {
          name: this.id,
          bar: progress_bar.line(
            index + 1,
            url,
            this.id.length > 6 ? this.id : ""
          )
        }
      )
    }

    await this.driver.close();
    return;
  }

  async start() {
    let urls = files.openFile(this.urls);
    this.urls = urls;
    await this.open();
  }
}
// let driver = new Driver();
// let urls = ['https://www.google.com', 'https://www.amazon.com', 'https://www.ebay.com', 'https://www.github.com']

// new Warmup(driver, urls).open()

module.exports = {
  Driver: Driver,
  Warmup: Warmup
}


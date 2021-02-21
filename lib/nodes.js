const { Builder, By, Key, until } = require('selenium-webdriver');
const { Driver } = require('./warmup')
const { Progress } = require('./progress');
const chalk = require('chalk');

module.exports = {
  Discover: class {
    constructor(cookie_name, url, nodes = [], headless = false) {
      this.cookie_name = cookie_name;
      this.url = url;
      this.nodes = nodes;
      this.node_count = nodes.length
      this.headless = headless
    }

    async start() {
      while (this.nodes.length < this.node_count + 1) {
        let driver = new Driver(this.headless);
        await driver.get(this.url)
        try {
          let cookie = await driver.manage().getCookie(this.cookie_name);
        } catch(err) {
          console.log(chalk.red.bold(`\nERROR: The cookie, "${this.cookie_name}," was not found. Please restart the warmup with the correct cookie name.\n`))
          process.exit()
        }
        cookie = cookie.value;
        if (!this.nodes.includes(cookie)) {
          this.nodes.push(cookie)
          return {
            "driver": driver,
            "value": cookie,
            "nodes": this.nodes
          }
        }
        driver.close();
      }
    }
  }
}
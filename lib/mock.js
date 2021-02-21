const { Driver } = require('./warmup')
const Crypto = require('crypto');

module.exports = {
  FakeDiscover: class {
    constructor(cookie_name, url, nodes = [], headless = false) {
      this.cookie_name = cookie_name;
      this.url = url;
      this.nodes = nodes;
      this.node_count = nodes.length
      this.headless = headless
    }

    randomNode(len) {
      return Crypto.randomBytes(len).toString('hex');
    }

    async start() {
      while (this.nodes.length < this.node_count + 1) {
        // console.log('Searching for a new node...')
        let driver = new Driver(this.headless);
        await driver.get("https://google.com/")

        let cookie = "";
        let dice = Math.floor(Math.random() * 4) + 1;
        if (this.nodes.length == 0 || dice == 4)
          cookie = this.randomNode(32)
        // else if (this.nodes.length == 2) {
        //   throw new Error('THIS IS A FAKE ERROR GENERATED IN MOCK.JS TO TEST THE ERROR HANDLING OF THIS PROGRAM.')
        // }
        else (cookie = this.nodes[0])
        // cookie = this.randomNode(32)

        if (!this.nodes.includes(cookie)) {
          // console.log('New node found!')
          this.nodes.push(cookie)
          return {
            "driver": driver,
            "value": cookie,
            "nodes": this.nodes
          }
        }
        // console.log('New node not found.')
        driver.close();

      }
    }
  }
}
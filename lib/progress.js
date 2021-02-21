const clui = require('clui');
const chalk = require('chalk');

module.exports = {
  Progress: class {
    constructor(width = 50, total = 100) {
      this.bar = new clui.Progress(width);
      this.total = total
    }
    truncate(msg, width) { // DO NOT PASS width < 3
      return msg.substring(0, width - 3) + (msg.length > width - 3 ? "..." : "")
    }
    line(curr, url, msg = "", logging_in = false) {
      let count = `(${curr}/${this.total})`,
        pbar = this.bar.update(curr, this.total),
        currently_on = curr == this.total ? chalk.green(`Complete.`) : chalk.blue(`Currently on ${this.truncate(url, 30)}`)
      currently_on = logging_in ? chalk.blue('Logging in...') : currently_on;
      msg.length > 0 ? msg = " | " + this.truncate(msg, 10) : ""
      return `${chalk.blue(count)}${msg} | ${pbar} | ${currently_on}`
    }
    spinner(msg) {
      let frames = ['.', 'o', 'O', '°', 'O', 'o', '.']
      let spinner = new clui.Spinner(msg, frames);
      return spinner
    }
  }
}
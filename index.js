#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const ask = require('./lib/ask')
const { Driver, Warmup } = require('./lib/warmup');
const files = require('./lib/files');
const { Discover } = require('./lib/nodes')
const Vue = require('vue')
const { Bus } = require('./lib/bus');
const _ = require('lodash');
// const { FakeDiscover } = require('./lib/mock')
// const { Login } = require('./lib/login')

clear();

console.log(
  chalk.cyan(
    figlet.textSync(files.name, { horizontalLayout: 'full' })
  )
);

console.log(`${chalk.bgGreen.bold(chalk.black(` v${files.version} `))} • ${chalk.bold.green(`Created by ${files.author}`)}\n`)

console.log(
  chalk.yellow(
    '>>> Warning! This program is not completely stable and it might have bugs/glitches within it.'
  ) + "\n"
);


let vm = new Vue({
  data: {
    progress_bars: [],
    preset: "",
  },
  methods: {
    init() {
      ask.InitialQuestions().then(async (answers) => {
        if (answers.action == 'Warmup Site') {
          if (files.presetsExist()) {
            let preset_info = await ask.WarmupPresetQuestions();

            if (preset_info.whichPreset) {
              this.preset = preset_info.whichPreset;
              answers = files.getPreset(preset_info.whichPreset);
            }
            else {
              let warmup_info = await ask.WarmupQuestions();
              answers = warmup_info;
              if (answers.name) files.saveSettings(answers)
            }

          }
          else {
            let warmup_info = await ask.WarmupQuestions();
            answers = warmup_info;
            if (answers.name) files.saveSettings(answers)
          }

          try {
            files.openFile(answers.urls);
          }
          catch {
            console.log(chalk.red.bold(`\nUnable to read the URLs list at ${answers.urls}.`) + chalk.yellow(`\nEither place the list back at this path or specify the list of\nURLs again, with its new path (i.e. don't choose 'load from preset').\n`))
            return;
          }

          if (answers.site == "D2C") {
            this.d2cWarmup(answers)
          }
          else if (answers.site == "B2B") {
            this.b2bWarmup(answers)
          }
        }
        else if (answers.action == 'Scan Site') {
          console.log('\nUnfortunately this doesn\'t support scanning yet.')
        }
        else {
          console.log('Congratulations. You found a way to break this program.')
        }
      })
    },
    async d2cWarmup(answers) {
      let driver = new Driver(answers.headless)
      let warmup = new Warmup(driver, answers.urls);
      this.closeBrowserWhenDone(warmup, driver);
    },
    async b2bWarmup(answers) {
      // console.log('Starting warmup...')
      let NODES = [];
      while (NODES.length < parseInt(answers.nodes)) {
        let discover = new Discover(answers.cookie, answers.url, NODES, answers.headless)
        let node = await discover.start();

        NODES = node.nodes;
        // console.log('Found node ' + node.value)
        // console.log('Warming up this node...')
        let warmup = new Warmup(node.driver, answers.urls, node.value, { login: true, email: answers.email, password: answers.password, url: answers.url });
        this.closeBrowserWhenDone(warmup, node.driver)
      }
    },
    pbUpdate(metadata) {
      // metadata = {
      //   name: "name",
      //   bar: "--- bar text ---"
      // }
      let index = _.findIndex(this.progress_bars, ['name', metadata.name]);
      index == -1 ? this.progress_bars.push(metadata) : this.progress_bars[index] = metadata;
      this.pbDisplay()
    },
    pbDelete(metadata) {
      _.pullAllBy(this.progress_bars, [{ 'name': metadata.name }], 'name')
      this.pbDisplay()
    },
    pbDisplay() {
      let bars_string = "\n\n";
      this.progress_bars.forEach(bar => bars_string += "   " + bar.bar + "\n")
      clear();
      console.log(
        chalk.cyan(
          figlet.textSync('WORKING...', { font: "Cybersmall", horizontalLayout: 'full' })
        ) + "\n"
      );
      console.log(this.preset.length > 0 ? chalk.bold.magenta(`   Running preset ${this.preset}.`) : "")
      console.log(bars_string)
    },
    async closeBrowserWhenDone(warmup_instance, driver) {
      try {
        // console.log('STARTING WARMUP...')
        await warmup_instance.start();
        // console.log('CLOSING BROWSER.')
        return true
      }
      catch (err) {
        // console.log('ERROR IN CLOSEBROWSERWHENDONE()')
        console.error(err)
        return false;
      }

    }
  },
  async created() {
    Bus.$on('progress-bar-update', this.pbUpdate)
    Bus.$on('progress-bar-delete', this.pbDelete)

    this.init()

  }
})

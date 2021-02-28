const chalk = require('chalk');
const inquirer = require('inquirer');
const files = require('./files');
const urlparse = require("url-parse");
const { parseDomain, ParseResultType, fromUrl } = require("parse-domain");

module.exports = {
  InitialQuestions: () => {
    const questions = [
      {
        name: 'action',
        type: 'list',
        message: 'What do you want to do?',
        choices: ['Warmup Site', 'Scan Site'],
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please choose one option';
          }
        }
      },
    ]
    return inquirer.prompt(questions)
  },
  WarmupQuestions: () => {
    const questions = [
      {
        name: 'site',
        type: 'list',
        message: 'Which site do you want to warmup?',
        choices: ['D2C', 'B2B'],
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please choose one option';
          }
        }
      },
      {
        when: (answers) => answers.site == "B2B" ? true : false,
        name: 'email',
        type: 'input',
        message: 'Email:',
        validate: function (value) {
          if (value.length && value.includes('@')) {
            return true;
          } else {
            return 'Please enter a valid email';
          }
        }
      },
      {
        when: (answers) => answers.site == "B2B" ? true : false,
        name: 'password',
        type: 'password',
        message: 'Password:',
        mask: true,
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a password';
          }
        }
      },
      {
        name: 'nodes',
        type: 'input',
        message: 'How many nodes are there?',
        default: "4",
        validate: function (value) {
          return /^(?:[1-9]|\d\d\d*)$/.test(value) ? true : 'Please enter an integer greater or equal to 1';
        }
      },
      {
        name: 'cookie',
        type: 'input',
        message: 'What\'s the name of the cookie containing the nodes?',
        // default: "" // cookie name,
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter the cookie name';
          }
        }
      },
      {
        name: 'url',
        type: 'input',
        message: 'What\'s the URL of the site?',
        // default: "" //url, // TODO: Change the default URL here for the D2C option; right now the default is the B2B site for both D2C and B2B options.
        validate: function (value) {
          const parseResult = parseDomain(fromUrl(value))
          return parseResult.type === ParseResultType.Listed ? true : "Please enter a valid URL."
        },
        filter: function (value) {
          return new Promise(resolve => {
            let url = new urlparse(value)   
            if(url.protocol != "http") url.set('protocol', 'https')
            resolve(url.toString())
          })
        }
      },
      {
        name: 'urls',
        type: 'input',
        message: 'What\'s the path to the file of the list of URLs?',
        default: chalk.magenta.bold('Hit enter to open a file picker (may take a little while)'),
        filter: () => {
          return new Promise(async (resolve, reject) => {
            while (true) {
              let file = await files.pickFile();
              if (file != "ERROR") { resolve(file); break; }
            }
          })

        }
      },
      // {
      //   name: 'chooseChromedriver',
      //   type: 'list',
      //   message: 'Do you want to specify the path to `chromedriver.exe`?',
      //   choices: ['No', 'Yes'],
      //   validate: function (value) {
      //     if (value.length) {
      //       return true;
      //     } else {
      //       return 'Please choose one option';
      //     }
      //   }
      // },
      // {
      //   name: 'chromedriver',
      //   when: (answers) => answers.chooseChromedriver == "Yes" ? true : false,
      //   type: 'input',
      //   message: 'What\'s the path to `chromedriver.exe`?',
      //   default: chalk.magenta('Hit enter to open a file picker'),
      //   filter: () => {
      //     return new Promise(async (resolve, reject) => {
      //       while (true) {
      //         let file = await files.pickFile();
      //         if (file != "ERROR") { resolve(file); break; }
      //       }
      //     })
      //   }
      // },
      {
        name: 'headless',
        type: 'list',
        message: 'Do you want to run the browser headless (in the background)?',
        choices: ['No', 'Yes'],
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please choose one option';
          }
        },
        filter: (value) => {
          return new Promise((resolve, reject) => {
            value == "Yes" ? resolve(true) : resolve(false);
          })
        }
      },
      {
        name: 'saveAsPreset',
        type: 'list',
        message: 'Would you like to save these settings as a preset for future use?',
        choices: ['Yes', 'No'],
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please choose one option';
          }
        }
      },
      {
        when: (answers) => answers.saveAsPreset == "Yes" ? true : false,
        name: 'name',
        type: 'input',
        message: 'Name this preset:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a preset name';
          }
        }
      },


    ];
    return inquirer.prompt(questions)
  },
  WarmupPresetQuestions: () => {
    const questions = [
      {
        name: "loadFromPreset",
        type: 'list',
        message: 'Would you like to load a saved preset?',
        choices: ['No - specify settings manually', 'Yes - load a previously saved preset'],
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please choose one option';
          }
        }
      },
      {
        when: (answers) => answers.loadFromPreset == "Yes - load a previously saved preset" ? true : false,
        name: "whichPreset",
        type: 'list',
        message: 'Which preset would you like to load?',
        choices: files.loadPresets(),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please choose one option';
          }
        }
      },


    ]
    return inquirer.prompt(questions)
  }
};
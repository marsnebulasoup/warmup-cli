const fs = require('fs');
const path = require('path');
const Configstore = require('configstore');
const pkg = require('../package.json');

module.exports = {
  version: pkg.version,
  author: pkg.author.name ? pkg.author.name : pkg.author,
  name: pkg.name,

  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },

  saveSettings: (settings) => {
    const conf = new Configstore(this.name);
    conf.set(settings.name, settings)
  },

  presetsExist: () => {
    const conf = new Configstore(this.name);
    return conf.size > 0
  },

  loadPresets: () => {
    const conf = new Configstore(this.name);
    return Object.keys(conf.all)
  },

  getPreset: (name) => {
    const conf = new Configstore(this.name);
    return conf.get(name);
  },

  presets: () => {
    const conf = new Configstore(this.name);
    return conf;
  },

  pickFile: () => {
    // Adapted from https://stackoverflow.com/a/51658369/8402369

    let psScript = `
      Function Select-FileDialog
      {

      [System.Reflection.Assembly]::LoadWithPartialName("System.windows.forms") |
          Out-Null     

        $objForm = New-Object System.Windows.Forms.OpenFileDialog

              $Show = $objForm.ShowDialog()
              If ($Show -eq "OK")
              {
                  Return $objForm.FileName
              }
              Else
              {
                  Write-Error "Operation cancelled by user."
              }
          }

      $file = Select-FileDialog # the variable contains user's file selection
      write-host $file
      `
    return new Promise((resolve, reject) => {
      var spawn = require("child_process").spawn, child;
      child = spawn("powershell.exe", [psScript]);
      child.stdout.on("data", function (data) {
        resolve(data.toString())
      });
      child.stderr.on("data", function (data) {
        //this script block will get the output of the PS script
        resolve("ERROR")
      });
      child.stdin.end(); //end input
    })

  },
  openFile: (filepath) => {
    let data = fs.readFileSync(filepath, 'utf8')
    return data.split('\n')
  },
  getVersion: () => {

  }
};
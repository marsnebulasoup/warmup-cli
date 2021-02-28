#!/usr/bin/env node
// Kills warnings
const { spawnSync } = require("child_process");
const { resolve } = require("path");

// Say our original entrance script is `app.js`
const cmd = "node --no-warnings " + resolve(__dirname, "app.js");
spawnSync(cmd, { stdio: "inherit", shell: true });



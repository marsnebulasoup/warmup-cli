![](./title.png)

---

## About

> `warmup-cli` is a command-line tool that lets you warm up pages of a site through a list of URLs, all through an easy-to-use interface. It has support for warming up pages on multiple nodes, and it can handle page logins too.

**Warning! This program is not completely stable and it might have bugs/glitches within it.**

Currently, Windows is the only supported OS. [Chrome](https://chrome.com/) is required, and is the only currently supported browser.

## Installation

### Quick and easy installation:

```
npm i -g warmup-cli
```

Run it with

```
warmup-cli
```

### Manual installation that takes too much time and shouldn't be attempted because it provides absolutely no extra benefit whatsoever:

1. Make sure you have node.js installed. Typing `node -v` in Command Prompt should give you its version, but if that fails, download and install it from [nodejs.org](https://nodejs.org).

2. Download the source code by going to Code > Download .ZIP above, if you're reading this on GitHub, or click [here](https://github.com/marsnebulasoup/warmup-cli/archive/main.zip).

3. Extract the .ZIP and move it to a safe place where it won't be accidentally deleted.

4. `cd` to the `warmup-cli-main\warmup-cli-main` folder in Command Prompt. Your location should look like this:

   ```
   C:\...\warmup-cli-main\warmup-cli-main>
   ```

   **Notice that you *must* `cd` to `warmup-cli-main\warmup-cli-main`, not just `warmup-cli-main`.**

5. Run `npm i -g` to install `warmup-cli`. A supported version of `chromedriver` will also be installed.

6. If the command succeeds, you should be able to run the program by typing `warmup-cli` into Command Prompt or Run.

## Changelog

- **v1.0.2** - 2/21/2021: *Fixed bug where package author name wasn't showing properly.*
- **v1.0.1** - 2/21/2021: *Minor updates to README. Package published to npm.*
- **v1.0.0** - 2/17/2021: *First version released. Scanning not yet supported.*

---

`warmup-cli` was created by Kevin Bryniak.


# CEKTOP

CEKTOP is a static site generator for GitHub Pages. It helps you bootstrap your website or app using a Grunt & Node.js that’s very configurable (so you’re not stuck with Jekyll or plain jane HTML/CSS/JavaScript).

Out of the box CEKTOP uses the following:

- [Jade](http://jade-lang.com/) with [Markdown filter](http://jade-lang.com/reference/#filters) support
- [Stylus](http://learnboost.github.io/stylus/) with [Nib](http://visionmedia.github.io/nib/) support
- [CoffeeScript](http://coffeescript.org/)
- [CoffeeLint](http://www.coffeelint.org/).
- [UglifyJS](http://marijnhaverbeke.nl//uglifyjs)
- [grunt-contib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)
- [grunt-gh-pages](https://github.com/tschaub/grunt-gh-pages)

If there’s a Grunt plugin for it you can use it; remove and extend things as needed. Once you’re satisfied with your work you can publish it with a single Grunt task.

## Example

You’re looking at it. The `master` branch of this repo contains the development files, while the `gh-pages` branch contains only the files needed for the [CEKTOP website](http://eswat.ca/cektop).

## Start

You will need [Node.js](http://nodejs.org/download/) installed to use CEKTOP.

- Download the [latest release](https://github.com/ESWAT/CEKTOP/releases) or clone the repo `git clone https://github.com/ESWAT/CEKTOP.git`
- `npm install -g grunt-cli coffee-script` if you do not have Grunt or CoffeeScript installed
- `npm install` for remaining dependencies
- `grunt` starts a server in development mode while `grunt prod` starts it in production mode, which optimizes your files as if you were ready to publish (both can be seen at [localhost:8000](http://localhost:8000/))
- `grunt build` will build production-ready files without publishing to GitHub Pages or updating the `gh-pages` branch
- `grunt shipit` will update your `gh-pages` branch with production-ready files and publish to GitHub Pages
- *Optional*: Install the [LiveReload extension for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) so your browser automatically refreshes whenever you make changes in development mode

## Structure

All your development work is done in the `src` directory. The files in `src` will be compiled and copied to the `release` directory as you work. The `release` directory is also used when publishing to GitHub Pages (see [grunt-gh-pages](https://github.com/tschaub/grunt-gh-pages) for details on the process). This directory will be cleaned up whenever you run a Grunt task and populated with the files necessary for that environment. So during development these files will be more verbose to help with debugging, but will be optimized when using any of the Grunt tasks that produces production-ready files.

```
├─ src/
│ ├─ assets/
│ ├─ script/
│ └─ stylus/
├─ release/
│ └─ assets/
│ ├─ js/
│ ├─ css/
├─ Gruntfile.coffee
├─ Gruntfile.js
├─ package.json
```

Most of the magic is done in `Gruntfile.coffee`, so take a look at that if you want to make modifications. Your Jade files also have visibility to some of the information stored in `package.json`, which you should modify to suit your project (you can see what is exposed in `Gruntfile.coffee` under the Jade task). `Gruntfile.js` is just a middleman to enable parsing our Gruntfile with CoffeeScript.

## License

CEKTOP is released under the [MIT License](LICENSE).

When creating deriative works that include writing, or anything you’re cautious about being modified freely, you should consider replacing this license with one from [Creative Commons](http://creativecommons.org/choose/) instead.

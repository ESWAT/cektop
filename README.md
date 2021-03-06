# CEKTOP

[![Dependency Status](https://david-dm.org/eswat/cektop.svg)](https://david-dm.org/eswat/cektop)

> Gulp-powered static site boilerplate for GitHub Pages.

**Note:** The content below is from previous versions and is only here for general reference.

CEKTOP helps you bootstrap your website or app using a Gulp & Node.js stack that’s very configurable. So you’re not stuck using the default setup of Jekyll or plain jane HTML/CSS/JavaScript.

Out of the box CEKTOP compiles Pug and CSS using PostCSS, compresses JS files with UglifyJS and compresses images with gulp-imagemin.

If there’s a Gulp plugin for it you can use it; remove and extend things as needed. Once you’re satisfied with your work you can publish it with a single Gulp task.

## Start

You will need [Node.js](http://nodejs.org/download/) installed to use CEKTOP.

- Download the [latest release](https://github.com/ESWAT/CEKTOP/releases) or clone the repo `git clone https://github.com/ESWAT/CEKTOP.git`
- `npm install -g gulp` if you do not have Gulp installed
- `npm install` for remaining dependencies
- `gulp` starts a server in development mode while `gulp preview` starts it in preview mode, which optimizes your files as if you were ready to publish (both can be seen at [localhost:8000](http://localhost:8000/))
- `gulp build` will build production-ready files without publishing to GitHub Pages or updating the `gh-pages` branch
- `gulp shipit` will update your `gh-pages` branch with production-ready files and publish to GitHub Pages
- *Optional*: Install the [LiveReload extension for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) so your browser automatically refreshes whenever you make changes in development mode

## Example

You’re looking at it. The `master` branch of this repo contains the development files, while the `gh-pages` branch contains only the files needed for the [CEKTOP website](http://eswat.ca/cektop).

The process of getting your work on GitHub Pages is pretty much…

1. Download or clone CEKTOP and install dependencies
2. Hack, hack, hack
3. `gulp shipit`

## Structure

All your development work is done in the `src` directory. The files in `src` will be compiled and copied to the `release` directory as you work. The `release` directory is also used when publishing to GitHub Pages (see [gulp-gh-pages](https://github.com/shinnn/gulp-gh-pages) for details on the process). This directory will be cleaned up whenever you run a Gulp task and populated with the files necessary for that environment. So during development these files will be more verbose to help with debugging, but will be optimized when using any of the Gulp tasks that produces production-ready files.

```
├─ src/
│ ├─ assets/
│ ├─ images/
│ ├─ script/
│ └─ stylus/
├─ release/
│ └─ assets/
│ ├─ images/
│ ├─ js/
│ ├─ css/
├─ gulpfile.js
├─ package.json
```

All of the magic is done in `gulpfile.js`, so take a look at that if you want to make modifications. Your Pug files also have visibility to some of the information stored in `package.json`, which you should modify to suit your project (you can see what is exposed in `gulpfile.js` under the Pug task).

## License

CEKTOP is released under the [MIT License](LICENSE).

When creating deriative works that include writing, or anything you’re cautious about being modified freely, you should consider replacing this license with one from [Creative Commons](http://creativecommons.org/choose/) instead.

# Master Builder
A reusable SCSS / JS builder for
- WordPress themes / plugins and
- static sites (using [Handlebars.js](handlebarsjs.com))

heavily based on [redaxo-mit-bimmelbam](https://github.com/FriendsOfREDAXO/redaxo-mit-bimmelbam) and [just-build-it](https://github.com/sympletech/just-build-it).

<img src="https://media.giphy.com/media/3ZALZoBtI1KJa/giphy.gif" alt="Lego timelapse" width="256" height="144">

### Getting started
1. Add scripts and the dependency to your project's package.json:
```
  "scripts": {
    "start": "master-builder"
  },
  "devDependencies": {
    ...
    "master-builder": "git+ssh://git@github.com:stevygee/master-builder.git"
  }
```
2. ```npm install```
3. ```npm start```

Optional: Copy .master-builder file to your project and configure to your needs!

### To do
- [ ] Add JSHint / gulp-jshint
- [ ] Add SassLint / gulp-sass-lint

### Development
How to add as a local dependency:
1. Install npm v4, you can do so globally using ```npm install -g npm@4```
2. Install [local-dependencies](https://github.com/aam229/local-dependencies): ```npm install --save-dev local-dependencies```
3. Modify scripts and dependencies in package.json:
```
  "scripts": {
    ...
    "configure-dependencies": "configure-local-dependencies",
    "install-dependencies": "install-local-dependencies",
    "watch-dependencies": "watch-local-dependencies"
  },
  "devDependencies": {
    ...
    "local-dependencies": "^1.0.0-beta3",
    "master-builder": "../master-builder"
  }
```
4. ```npm install```
5. Use ```npm run install-dependencies``` to generate a .ldrc file, make sure it contains the absolute path to master-builder
6. ```npm run install-dependencies```
7. ```npm start```

Use ```npm run watch-dependencies``` to continously update the package as you make changes.

<img src="https://media.giphy.com/media/JJhiRdcYfcokU/giphy.gif" alt="Lego Batman" width="256" height="167">

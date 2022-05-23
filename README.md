# Master Builder
A reusable SCSS / JS builder

heavily based on [redaxo-mit-bimmelbam](https://github.com/FriendsOfREDAXO/redaxo-mit-bimmelbam) and [just-build-it](https://github.com/sympletech/just-build-it).

<img src="https://media.giphy.com/media/3ZALZoBtI1KJa/200w_d.gif" alt="Lego timelapse" width="256" height="144">

### Requirements
- Node 12

### Features
- Understands JSX / React for WordPress blocks
- PostCSS
- Autoprefixer
- CSS nano
- Browserify
- etc.

### Getting started
1. Add scripts to your project's package.json:
```
  "scripts": {
    "start": "master-builder",
    "build": "master-builder build",
    "deploy": "master-builder deploy"
  },
```
2. ```npm install @stevygee/master-builder --save-dev```
3. ```npm start```

Optional: Copy `.master-builder`, `.browserslistrc`, `cssnano.config.js` config files to your project and configure to your needs!

### Building for production
1. ```npm run build```

### Building for production and create a zip file
1. ```npm run deploy```
2. Upload the zip file in dist/packages using WordPress (install theme/plugin).

### Development
1. Checkout this repo
3. ```npm install``` (make sure you are using npm v7)
4. Instead of `npm start`, use `node bin/index.js` or `node bin/index.js deploy` to build the example files

### Development using your project
How to add as a local dependency:
1. Checkout this repo
2. Change the dependency path in your project's package.json:
```
  "devDependencies": {
    ...
    "@stevygee/master-builder": "../master-builder"
  }
```
3. In your project root: ```npm install @babel/core @babel/preset-env @babel/preset-react babel-preset-minify babelify tinyify```

Use ```npm install``` to continously update the package after you've made a change.

<img src="https://media.giphy.com/media/JJhiRdcYfcokU/giphy.gif" alt="Lego Batman" width="256" height="167">

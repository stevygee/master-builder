# Master Builder
A reusable SCSS / JS builder, now based on esbuild!

<img src="https://media.giphy.com/media/3ZALZoBtI1KJa/200w_d.gif" alt="Lego timelapse" width="256" height="144">

### Requirements
- Node 12

### Features
- Super fast!
- JSX
- Sass / SCSS
- PostCSS
- Autoprefixer
- Browserslist support
- Copy additional files
- Compress all files into a ZIP
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

Optional: Copy `.master-builder`, `.browserslistrc` config files to your project and configure to your needs!

### Building for production
1. ```npm run build```

### Building for production and create a zip file
1. ```npm run deploy```
2. Upload the zip file in dist/packages for use in WordPress (install theme/plugin).

### Development
1. Checkout this repo
3. ```npm install```
4. Instead of `npm start`, use `node bin/index.js` or `node bin/index.js deploy` to build the example files

### Development using your project
How to add as a local dependency:
1. Checkout this repository in a sibling directory next to your project
2. Change the dependency path in your project's package.json:
```
  "devDependencies": {
    ...
    "@stevygee/master-builder": "../master-builder"
  }
```
3. Use ```npm install``` to continously update the package after you've made a change.

<img src="https://media.giphy.com/media/JJhiRdcYfcokU/giphy.gif" alt="Lego Batman" width="256" height="167">

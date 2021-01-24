# next-image-meta-loader [![npm version](https://badgen.net/npm/v/next-image-meta-loader)](https://www.npmjs.com/package/next-image-meta-loader) [![license](https://badgen.net/github/license/tinialabs/next-image-meta-loader)](https://github.com/tinialabs/next-image-meta-loader/blob/master/LICENSE) [![downloads](https://badgen.net/npm/dt/next-image-meta-loader)](https://www.npmjs.com/package/next-image-meta-loader)

Features:
- **Enhanced file-loader** Loads image assets directly into Next.js public folder no matter where the source file is
- **Sizing** Looks up the size of the image and provides height, width and aspect ratio, for use in `next/image` and other optimizers (to prevent layout shift)
- **Rotates using EXIF data** Before saving the image, rotates it using the EXIF data portrait/landscape if appropriate
- **Generates LQIP** Calculates a 16px low quality image placeholder and provides as a BASE 64 data string to be embedded directly in HTML
- **Returns Meta Data** Turns any `import` or `require` statement into an object that contains not only the file name but all the above meta data;  works both server side and client side in Next.JS, compatible with SSG and SSR

## Table of contents

- [Installation](#installation)
- [Options](#options)
- [Usage](#usage)
- [License](#license)

## Installation

```
npm install next-image-meta-loader next-compose-plugins
```

Add the plugin with [`next-compose-plugins`](https://github.com/cyrilwanner/next-compose-plugins) to your Next.js configuration:

```javascript
// next.config.js
const withPlugins = require("next-compose-plugins");
const nextImageMetaLoader = require("next-image-meta-loader");

module.exports = withPlugins([
  nextImageMetaLoader
  // your other plugins here
]);
```

## Options
| Option | Default | Type | Description |
| :--- | :------: | :--: | :---------- |
| contentThemeFolder | './content/theme' | string | The folder where theme files including favicon are kept |
| imageMetaOutput | './static/media' | string |The public folder where all output will be placed  |
| imageMetaExtensions | ['svg', 'png', 'jpe?g', 'gif', 'mp4'] | Array<string> |  The list of extensions to process |
| imageMetaName | '[name].[hash].[ext]' | string | The naming convention of the output files  |

## Usage

You can now simply import images in your projects directly from source folders.  

``` js
   const meta = require('./images/narative-output.png')

  /** meta now contains: {
    width: 800,
    height: 600
    aspectRatio: 1.25,
    blurWidth: 16,
    blurHeight: 13,
    lqip: 'data:image/webp;base64,XXXXXXXX',
    src: 'static/media/XXXXX' // actual location of file in the Next.js public folder
    }
    */
```

With the right mdx component that does a require like the above, you can also include directly in MDX and get the advantage of lqip, lazy loading, next.js image optimization etc..   See [next-theme-novela](https://github.com/tinialabs/next-theme-novela) for an example of such an `Image` component.

``` mdx
![This is the alt text](./images/narative-output.png)
```

## License

Licensed under the [MIT](https://github.com/tinialabs/next-image-meta-loader/blob/master/LICENSE) license.

© Copyright Guy Barnard and Tinia Labs contributors
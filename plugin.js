const path = require('path')

/**
 * @typedef PluginProps
 * @type {object}
 * @property {string} contentThemeFolder - The folder where theme files including favicon are kept ['./content/theme']
 * @property {string} imageMetaOutput - The public folder where all output will be placed ['./static/media']
 * @property {Array<string>} imageMetaExtensions - The list of extensions to process [svg', 'png', 'jpe?g', 'gif', 'mp4']
 * @property {string} imageMetaName - The naming convention of the output files ['[name].[hash].[ext]']
 */

/**
 * This is a Next.js plugin that installs a webpack image loader module 
 * that includes meta data and lqip
 * @param {PluginProps} nextConfig
 */
module.exports = function nextImageMetaLoader(nextConfig = {}) {

  mergeDefaults(nextConfig, {
    imageMetaOutput: './static/media',
    contentThemeFolder: './content/theme',
    imageMetaExtensions: ['svg', 'png', 'jpe?g', 'gif', 'mp4'],
    imageMetaName: '[name].[hash].[ext]'
  })

  // strip leading ./ from output path
  nextConfig.imageMetaOutput = nextConfig.imageMetaOutput.replace(/^\.?\/?/, '')

  return Object.assign({}, nextConfig, {
    webpack: (config, ...rest) => {
      config.module.rules.push({
        test: new RegExp(`\\.(${nextConfig.imageMetaExtensions.join('|')})$`, "i"),
        exclude: [path.resolve(process.cwd(), nextConfig.contentThemeFolder)],
        use: [
          {
            loader: path.resolve(__dirname, './dist/index.js'),
            options: {
              outputPath: nextConfig.imageMetaOutput,
              publicPath: `/_next/${nextConfig.imageMetaOutput}`,
              name: nextConfig.imageMetaName,
              esModule: false,
              type: 'javascript/auto'
            }
          }
        ]
      })

      return nextConfig.webpack(config, ...rest)
    },
  })
}

const mergeDefaults = function (opts, defaults) {
  for (i in defaults) {
    if (!(i in opts)) {
      opts[i] = defaults[i];
    }
  }
  return opts;
}
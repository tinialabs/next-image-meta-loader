import path from 'path'

import { getOptions, interpolateName } from 'loader-utils'
import { validate } from 'schema-utils'

import schema from './options.json'
import { normalizePath } from './utils'
import processImage from './process-image'

export default async function loader(this: any, content: Buffer) {
  if (!/\.(svg|png|jpe?g|gif|mp4)$/i.test(this.resourcePath)) {
    return ''
  }
  const callback = this.async()
  void (async () => {
    const options: any = {
      outputPath: 'static/media',
      publicPath: '/_next/static/media',
      name: '[name].[hash].[ext]',
      esModule: false,
      type: 'javascript/auto',
      ...getOptions(this)
    }

    validate(schema as object, options, {
      name: 'File Loader',
      baseDataPath: 'options'
    })

    const context = options.context || this.rootContext
    const name = options.name || '[contenthash].[ext]'

    const url = interpolateName(this, name as string, {
      context,
      content,
      regExp: options.regExp
    })

    let outputPath = url

    if (options.outputPath) {
      if (typeof options.outputPath === 'function') {
        outputPath = options.outputPath(url, this.resourcePath, context)
      } else {
        outputPath = path.posix.join(options.outputPath, url)
      }
    }

    let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`

    if (options.publicPath) {
      if (typeof options.publicPath === 'function') {
        publicPath = options.publicPath(url, this.resourcePath, context)
      } else {
        publicPath = `${
          options.publicPath.endsWith('/')
            ? options.publicPath
            : `${options.publicPath}/`
        }${url}`
      }
    }

    if (options.postTransformPublicPath) {
      publicPath = options.postTransformPublicPath(publicPath)
    }

    if (typeof options.emitFile === 'undefined' || options.emitFile) {
      const assetInfo: any = {}

      if (typeof name === 'string') {
        let normalizedName = name

        const idx = normalizedName.indexOf('?')

        if (idx >= 0) {
          normalizedName = normalizedName.substr(0, idx)
        }

        const isImmutable = /\[([^:\]]+:)?(hash|contenthash)(:[^\]]+)?]/gi.test(
          normalizedName
        )

        if (isImmutable === true) {
          assetInfo.immutable = true
        }
      }

      assetInfo.sourceFilename = normalizePath(
        path.relative(this.rootContext, this.resourcePath)
      )
      this.emitFile(outputPath, content, null, assetInfo)
    }

    const imageData = await processImage(content)

    callback(
      null,
      `module.exports = () =>${JSON.stringify({
        ...imageData,
        src: publicPath
      })}`
    )
  })()
}

export const raw = true

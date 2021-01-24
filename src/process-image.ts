import sharp from 'sharp'

export default async function processImage(input: Buffer) {
  const image = sharp(input).rotate()
  const srcMeta = await image.metadata()

  const resized = image.resize(
    Math.min(srcMeta.width!, 16),
    Math.min(srcMeta.height!, 16),
    { fit: 'inside' }
  )

  const output = resized.webp({
    quality: 20,
    alphaQuality: 20,
    smartSubsample: true
  })

  const { data, info: blurMeta } = await output.toBuffer({
    resolveWithObject: true
  })

  return {
    width: srcMeta.width,
    height: srcMeta.height,
    aspectRatio: srcMeta.width! / srcMeta.height!,
    blurWidth: blurMeta.width,
    blurHeight: blurMeta.height,
    type: 'webp',
    lqip: `data:image/webp;base64,${data.toString('base64')}`,
    isExport: process.env.NEXT_ENV === 'export'
  }
}

import {createImageUrlBuilder} from '@sanity/image-url'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'
const builder = projectId ? createImageUrlBuilder({projectId, dataset}) : null

export type Pic = {src: string; srcset?: string; width: number; height: number; alt: string; lqip?: string}

/**
 * Turn a Sanity image into a responsive <img> description.
 * Sanity's CDN does the resizing and serves WebP/AVIF automatically (auto=format).
 * `aspect` = width/height to crop to (uses the hotspot chosen in the admin). Leave out to keep the original shape.
 */
export function pic(image: any, opts: {width: number; aspect?: number; alt?: string}): Pic | null {
  if (!image?.asset || !builder) return null
  const dims = image.asset.metadata?.dimensions
  const ratio = opts.aspect ?? (dims ? dims.width / dims.height : 4 / 3)
  const widths = [0.5, 1, 1.5, 2].map((m) => Math.round(opts.width * m)).filter((w, i, a) => a.indexOf(w) === i && (!dims || w <= dims.width * 1.05))
  if (!widths.length) widths.push(Math.min(opts.width, dims?.width || opts.width))
  const url = (w: number) => {
    let b = builder.image(image).width(w).auto('format').quality(72)
    if (opts.aspect) b = b.height(Math.round(w / ratio)).fit('crop')
    return b.url()
  }
  return {
    src: url(opts.width),
    srcset: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: opts.width,
    height: Math.round(opts.width / ratio),
    alt: opts.alt ?? image.alt ?? '',
    lqip: image.asset.metadata?.lqip,
  }
}

/** Absolute URL for share previews (1200×630) */
export function ogUrl(image: any): string | null {
  if (!image?.asset || !builder) return null
  return builder.image(image).width(1200).height(630).fit('crop').auto('format').url()
}

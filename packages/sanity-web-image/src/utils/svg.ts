export const SVG = 'svg'

export async function fetchSvgMarkup(
  src?: string,
  alt?: string,
  fetch: (typeof window)['fetch'] = window?.fetch,
) {
  if (!src) {
    return
  }

  try {
    const response = await fetch(src, { mode: 'cors' })
    if (!response.ok) {
      throw Error(response.statusText)
    }

    const source = await response.text()

    if (!source.startsWith('<svg')) {
      throw Error('Not an SVG file')
    }

    return alt ?
        source.replace(
          /(<.*?>)(.*)/,
          (_, openingTag, svgContent) => `${openingTag}<title>${alt}</title>${svgContent}`,
        )
      : source
  } catch (e) {
    console.error('Error retrieving SVG source', e)
  }
}

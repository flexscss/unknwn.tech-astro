import type { ImageMetadata } from 'astro'

export function getImage(imagePath: string) {
  const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpeg,jpg,png,gif,webp}')
  const image = images[`/src/assets/images${imagePath}`]
  if (!image)
    throw new Error(`Image does not exist in glob: "/src/assets/images${imagePath}"`)
  return image
}

import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vue from '@astrojs/vue'

// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://unknwn.tech',
  server: {
    port: 5173
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    vue()
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [{
      path: 'en',
      codes: ['en', 'en-US']
    }, {
      path: 'ru',
      codes: ['ru', 'ru-RU']
    }],
    routing: {
      prefixDefaultLocale: false
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false
      }
    }
  }
})

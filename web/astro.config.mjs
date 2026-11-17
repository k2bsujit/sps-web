import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '')
const site = env.PUBLIC_SITE_URL || 'https://www.example.com'

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file', // /services/home-solar.html → served as /services/home-solar on Hostinger via .htaccess
    inlineStylesheets: 'always', // one less request: CSS is small, so it ships inside each page
  },
  compressHTML: true,
  prefetch: {prefetchAll: false, defaultStrategy: 'hover'},
  image: {
    // Sanity's CDN resizes images for us; allow it for any future <Image> use
    domains: ['cdn.sanity.io'],
  },
})

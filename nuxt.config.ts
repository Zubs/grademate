// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },

  srcDir: 'app/',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  routeRules: {
    '/dashboard/**': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
  },

  nitro: {
    prerender: {
      // Calculator pages arrive in feature 21. Remove this once they exist.
      ignore: ['/calculator'],
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#131209' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap'
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://grademate.xyz',
    },
  },

  compatibilityDate: '2024-09-10',
})

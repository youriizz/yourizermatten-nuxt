export default defineNuxtConfig({
  modules: ['@nuxt/content'],

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/projects/bisses-du-valais',
        '/projects/dynamic-disk-covers',
        '/projects/graumagazin-com',
        '/projects/randomshit666-com',
        '/projects/this-is-a-tentative-of-deconstruction-of-a-wordpress-website',
      ],
    },
  },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/colors.css',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/typography.css',
    '~/assets/css/layout.css',
    '~/assets/css/components.css',
    '~/assets/css/swup.css',
    '~/assets/css/showcase-index.css',
    '~/assets/css/project.css',
  ],

  app: {
    pageTransition: { name: 'page' },
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', href: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/favicon/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' },
      ],
    },
  },

  content: {
    highlight: false,
  },

  compatibilityDate: '2025-06-01',
})

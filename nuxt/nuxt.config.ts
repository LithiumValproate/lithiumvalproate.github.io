export default defineNuxtConfig({
  ssr: false,

  app: {
      baseURL: '/',
  },

  nitro: {
      preset: 'static',
      prerender: {
          outputDir: 'dist',
      },
  },

  target: 'static',
  compatibilityDate: '2025-05-15',
  modules: ['@nuxtjs/tailwindcss'],
})
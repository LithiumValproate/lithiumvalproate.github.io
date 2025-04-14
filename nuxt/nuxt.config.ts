export default defineNuxtConfig({
  compatibilityDate: "2025-04-14",
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    baseURL: '/',
  },
  ssr: false,
  target: 'static', 
})
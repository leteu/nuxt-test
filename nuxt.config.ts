// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: 'https://jsonplaceholder.typicode.com'
    }
  },
  app: {
    baseURL: '/nuxt-test/'
  }
})
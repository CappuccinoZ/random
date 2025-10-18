// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    randomApiSecret: '',
    public: {
      randomApiBase: 'https://api.qrng.outshift.com/api/v1/random_numbers',
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})

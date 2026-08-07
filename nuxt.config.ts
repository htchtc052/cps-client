// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-sanctum'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  sanctum: {
    baseUrl: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8001',
    mode: 'cookie',
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
      user: '/api/account',
    },
    redirect: {
      onLogin: '/owner',
      onLogout: '/login',
      onAuthOnly: '/login',
      onGuestOnly: '/owner',
    },
  },
})

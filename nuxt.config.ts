// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-auth-sanctum'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  sanctum: {
    // The module reads its private runtime config during SSR and the public one in
    // the browser, so the API origin is set once here and lands in both.
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

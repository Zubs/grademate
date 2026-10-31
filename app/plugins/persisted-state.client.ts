import { useAcademicStore } from '~/stores/academic'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const hydrate = () => {
    useAuthStore(nuxtApp.$pinia as never).hydrate()
    useAcademicStore(nuxtApp.$pinia as never).hydrate()
  }

  if (nuxtApp.payload.serverRendered) {
    nuxtApp.hooks.hookOnce('app:suspense:resolve', hydrate)
  } else {
    hydrate()
  }
})

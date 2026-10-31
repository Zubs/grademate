<template>
  <div class="min-h-screen">
    <SkipLink />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface p-4 tablet:visible tablet:translate-x-0"
      :class="sidebarOpen ? 'sidebar translate-x-0' : 'sidebar invisible -translate-x-full'"
    >
      <div class="flex items-center justify-between">
        <AppLogo />
        <button type="button" class="flex size-10 items-center justify-center rounded-lg text-ink-soft hover:bg-raised tablet:hidden" aria-label="Close menu" @click="sidebarOpen = false">
          <PhX :size="16" aria-hidden="true" />
        </button>
      </div>

      <nav class="mt-8 flex flex-col gap-1" aria-label="Dashboard">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :exact-active-class="item.exact ? 'nav-item-active' : undefined"
          :active-class="item.exact ? undefined : 'nav-item-active'"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" :size="16" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex-1" />

      <div class="flex flex-col gap-4 border-t border-line pt-4">
        <div class="flex items-center gap-3">
          <span class="caption-3 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent">{{ auth.user?.avatarInitials }}</span>
          <div class="min-w-0">
            <p class="title-4 truncate">{{ auth.user?.name }}</p>
            <p class="caption-5 truncate text-ink-muted">{{ auth.user?.email }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <ColorModeToggle />
          <button type="button" class="button button-secondary button-small" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black/60 tablet:hidden" @click="sidebarOpen = false" />

    <div class="flex min-h-screen min-w-0 flex-col tablet:ml-64">
      <header class="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-canvas/80 px-4 py-3 backdrop-blur-md tablet:px-8">
        <button type="button" class="flex size-10 items-center justify-center rounded-lg text-ink hover:bg-raised tablet:hidden" aria-label="Open menu" @click="sidebarOpen = true">
          <PhList :size="24" aria-hidden="true" />
        </button>
        <span class="title-3">{{ pageTitle }}</span>
        <span class="tag tabular ml-auto">CGPA <strong class="caption-3 text-accent-ink">{{ academic.cgpa.toFixed(2) }}</strong></span>
      </header>

      <main id="main-content" class="min-w-0 flex-1 px-4 py-8 outline-none tablet:px-8" tabindex="-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhCalendarBlank, PhGear, PhList, PhSquaresFour, PhTarget, PhX } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

const auth = useAuthStore()
const academic = useAcademicStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: PhSquaresFour, exact: true },
  { to: '/dashboard/semesters', label: 'Semesters', icon: PhCalendarBlank, exact: false },
  { to: '/dashboard/forecast', label: 'Forecaster', icon: PhTarget, exact: false },
  { to: '/dashboard/settings', label: 'Settings', icon: PhGear, exact: false },
]

const pageTitle = computed(() => navItems.find(item => item.to === route.path)?.label ?? 'Dashboard')

async function handleLogout() {
  auth.logout()
  await router.push('/')
}
</script>

<style scoped>
@reference '~/assets/css/main.css';

.sidebar {
  transition: transform 500ms var(--ease-weighted), visibility 500ms;
}

.nav-item {
  @apply body-5 flex items-center gap-3 rounded-lg px-3 py-2 text-ink-soft;
  transition: background-color 300ms var(--ease-weighted), color 300ms var(--ease-weighted);
}

.nav-item:hover {
  @apply bg-raised text-ink;
}

.nav-item-active {
  @apply bg-raised text-ink;
}

.nav-item-active :deep(svg) {
  @apply text-accent-ink;
}
</style>

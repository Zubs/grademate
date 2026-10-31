<template>
  <div class="flex min-h-screen flex-col">
    <SkipLink />

    <header class="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div class="flex w-full items-center justify-between gap-6 rounded-2xl border border-line bg-surface/80 py-2 pr-2 pl-3 backdrop-blur-md tablet:w-auto">
        <AppLogo />

        <nav class="hidden items-center gap-1 tablet:flex" aria-label="Main">
          <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-2 tablet:flex">
          <ColorModeToggle />
          <template v-if="auth.isAuthenticated">
            <NuxtLink to="/dashboard" class="button button-primary button-small">Open dashboard</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav-link">Sign in</NuxtLink>
            <NuxtLink to="/register" class="button button-primary button-small">Create account</NuxtLink>
          </template>
        </div>

        <button
          type="button"
          class="relative z-10 flex size-10 items-center justify-center rounded-lg text-ink tablet:hidden"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <span class="menu-line" :class="menuOpen ? 'rotate-45' : '-translate-y-1'" />
          <span class="menu-line" :class="menuOpen ? '-rotate-45' : 'translate-y-1'" />
        </button>
      </div>
    </header>

    <div
      class="mobile-panel fixed inset-0 z-40 flex flex-col gap-2 bg-canvas/95 px-6 pt-24 pb-8 backdrop-blur-xl tablet:hidden"
      :class="menuOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'"
      :inert="!menuOpen"
    >
      <nav class="flex flex-col gap-2" aria-label="Menu">
        <NuxtLink
          v-for="(link, index) in links"
          :key="link.to"
          :to="link.to"
          class="mobile-link heading-5 py-2"
          :class="{ 'mobile-link-in': menuOpen }"
          :style="{ transitionDelay: menuOpen ? `${index * 60}ms` : '0ms' }"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div class="mt-auto flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="title-4 text-ink-soft">Theme</span>
          <ColorModeToggle />
        </div>
        <NuxtLink v-if="auth.isAuthenticated" to="/dashboard" class="button button-primary" @click="menuOpen = false">
          Open dashboard
        </NuxtLink>
        <template v-else>
          <NuxtLink to="/register" class="button button-primary" @click="menuOpen = false">Create your free account</NuxtLink>
          <NuxtLink to="/login" class="button button-secondary" @click="menuOpen = false">Sign in</NuxtLink>
        </template>
      </div>
    </div>

    <main id="main-content" class="flex-1 outline-none" tabindex="-1">
      <slot />
    </main>

    <footer class="border-t border-line">
      <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 tablet:flex-row tablet:justify-between">
        <div class="flex flex-col gap-2">
          <AppLogo class="self-start" />
          <p class="body-6 text-ink-soft">Every grade, every semester, in one place.</p>
          <p class="caption-5 mt-2 text-ink-muted">© {{ new Date().getFullYear() }} GradeMate</p>
        </div>
        <div class="flex gap-12">
          <nav class="flex flex-col gap-2" aria-label="Product">
            <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
          </nav>
          <nav class="flex flex-col gap-2" aria-label="Legal and contact">
            <NuxtLink to="/privacy" class="footer-link">Privacy</NuxtLink>
            <NuxtLink to="/terms" class="footer-link">Terms</NuxtLink>
            <a href="mailto:zubairidrisaweda@gmail.com" class="footer-link">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const menuOpen = ref(false)

const links = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#faq', label: 'FAQ' },
]
</script>

<style scoped>
@reference '~/assets/css/main.css';

.nav-link {
  @apply body-5 rounded-lg px-3 py-2 text-ink-soft;
  transition: color 300ms var(--ease-weighted), background-color 300ms var(--ease-weighted);
}

.nav-link:hover {
  @apply bg-raised text-ink;
}

.footer-link {
  @apply body-6 rounded text-ink-soft;
  transition: color 300ms var(--ease-weighted);
}

.footer-link:hover {
  @apply text-ink;
}

.menu-line {
  @apply absolute h-0.5 w-6 rounded bg-current;
  transition: transform 500ms var(--ease-weighted);
}

.mobile-panel {
  transition: opacity 300ms var(--ease-weighted), visibility 300ms;
}

.mobile-link {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms var(--ease-weighted), transform 500ms var(--ease-weighted);
}

.mobile-link-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .mobile-link {
    transform: none;
  }
}
</style>

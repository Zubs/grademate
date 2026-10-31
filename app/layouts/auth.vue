<template>
  <div class="grid min-h-screen tablet:grid-cols-2">
    <SkipLink />

    <div class="flex flex-col px-6 py-6 tablet:min-h-screen">
      <header class="flex items-center justify-between">
        <AppLogo />
        <ColorModeToggle />
      </header>

      <main id="main-content" class="flex flex-1 items-center justify-center py-12 outline-none" tabindex="-1">
        <slot />
      </main>

      <footer class="caption-2 flex flex-wrap items-center justify-between gap-4 text-ink-muted">
        <span>© {{ new Date().getFullYear() }} GradeMate</span>
        <nav class="flex gap-4" aria-label="Legal">
          <NuxtLink to="/privacy" class="text-link">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="text-link">Terms</NuxtLink>
        </nav>
      </footer>
    </div>

    <aside class="dark relative isolate order-first h-40 overflow-hidden text-ink tablet:order-none tablet:h-auto">
      <NightScene class="-z-10" align="xMinYMax" />
      <div class="hidden flex-col gap-4 px-12 pt-24 tablet:flex">
        <p class="heading-3 max-w-hero">Every semester is a star.<br>Chart the line to where you want to finish.</p>
        <p class="body-3 text-ink">Track every grade, then see what it takes to reach your target.</p>
      </div>
    </aside>
  </div>
</template>

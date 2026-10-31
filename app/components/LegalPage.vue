<template>
  <article class="mx-auto flex max-w-2xl flex-col gap-8 px-6 pt-24 pb-16">
    <div class="flex flex-col gap-2 pt-8">
      <h1 class="heading-4">{{ title }}</h1>
      <p class="caption-2 text-ink-muted">Last updated {{ updated }}</p>
    </div>
    <div class="legal-copy flex flex-col gap-6">
      <slot />
    </div>
    <NuxtLink to="/" class="text-link body-5 self-start">Back to home</NuxtLink>
  </article>
</template>

<script setup lang="ts">
defineProps<{ title: string, updated: string }>()
</script>

<style scoped>
@reference '~/assets/css/main.css';

.legal-copy :deep(h2) {
  @apply heading-6 mb-2;
}

.legal-copy :deep(p) {
  @apply body-3 text-ink-soft;
}
</style>

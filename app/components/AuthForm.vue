<template>
  <div class="w-full max-w-sm">
    <h1 class="heading-4">{{ title }}</h1>
    <p class="body-6 mt-2 text-ink-soft">{{ subtitle }}</p>
    <div class="mt-8 flex flex-col gap-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string, subtitle: string }>()
</script>

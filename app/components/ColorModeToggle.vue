<template>
  <button
    type="button"
    class="flex size-10 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-raised hover:text-ink"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
    @click="$colorMode.preference = isDark ? 'light' : 'dark'"
  >
    <PhSun v-if="isDark" :size="16" aria-hidden="true" />
    <PhMoon v-else :size="16" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { PhMoon, PhSun } from '@phosphor-icons/vue'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

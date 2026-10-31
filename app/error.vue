<template>
  <div class="dark relative isolate flex min-h-screen flex-col items-center overflow-hidden px-6 pt-24 text-center text-ink">
    <SkipLink />
    <NightScene class="-z-10" />
    <PhStarFour :size="48" weight="fill" class="text-accent-ink" aria-hidden="true" />
    <main id="main-content" class="mt-4 flex flex-col items-center outline-none" tabindex="-1">
      <p class="caption-3 tabular text-ink-soft">{{ error?.statusCode }}</p>
      <h1 class="heading-2 mt-2 max-w-hero">{{ notFound ? 'This star isn\'t on your chart' : 'Something went wrong' }}</h1>
      <p class="body-3 mt-4 max-w-hero text-ink">
        {{ notFound ? 'The page you opened doesn\'t exist or has moved.' : 'The page couldn\'t load. Go back home and try again.' }}
      </p>
      <button type="button" class="button button-primary mt-8" @click="clearError({ redirect: '/' })">
        Back to home
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { PhStarFour } from '@phosphor-icons/vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error?.statusCode === 404)

useSeoMeta({ title: () => `${notFound.value ? 'Page not found' : 'Error'} | GradeMate` })
</script>

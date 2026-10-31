<template>
  <h2 ref="heading" class="heading-2 max-w-hero">
    <span v-for="(line, lineIndex) in lines" :key="line" class="block">
      <span
        v-for="(word, wordIndex) in line.split(' ')"
        :key="`${lineIndex}-${wordIndex}`"
        class="tagline-word"
      >{{ word }}{{ ' ' }}</span>
    </span>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ lines: string[] }>()

const heading = ref<HTMLElement | null>(null)
const stepMs = 90
let observer: IntersectionObserver | null = null
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (!heading.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const words = [...heading.value.querySelectorAll<HTMLElement>('.tagline-word')]
  words.forEach(word => word.classList.add('tagline-muted'))
  let next = 0
  let reached = -1

  const advance = () => {
    timer = undefined
    if (next > reached) {
      return
    }

    words[next]?.classList.remove('tagline-muted')
    words[next]?.setAttribute('data-revealed', String(Date.now()))
    next += 1
    timer = setTimeout(advance, stepMs)
  }

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        reached = Math.max(reached, words.indexOf(entry.target as HTMLElement))
        observer?.unobserve(entry.target)
      }
    }
    if (timer === undefined) {
      advance()
    }
  }, { rootMargin: '0px 0px -30% 0px' })
  words.forEach(word => observer?.observe(word))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
})
</script>

<style scoped>
.tagline-word {
  transition: opacity 500ms var(--ease-weighted);
}

.tagline-muted {
  opacity: 0.3;
}
</style>

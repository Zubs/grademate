<template>
  <svg
    class="absolute inset-0 size-full"
    viewBox="0 0 1600 1000"
    :preserveAspectRatio="`${align} slice`"
    aria-hidden="true"
  >
    <rect width="1600" height="1000" fill="#0b1026" />
    <circle cx="660" cy="800" r="760" fill="#121638" />
    <circle cx="660" cy="800" r="620" fill="#1d1c49" />
    <circle cx="660" cy="800" r="500" fill="#33235a" />
    <circle cx="660" cy="800" r="390" fill="#5a2a60" />
    <circle cx="660" cy="800" r="295" fill="#8f3a55" />
    <circle cx="660" cy="800" r="210" fill="#c8583c" />
    <circle cx="660" cy="800" r="135" fill="#f08a2e" />
    <circle cx="660" cy="800" r="75" fill="#f5a623" />

    <circle
      v-for="star in stars"
      :key="star.id"
      :cx="star.x"
      :cy="star.y"
      :r="star.size"
      fill="#fff6e0"
      :opacity="star.opacity"
      :class="{ twinkle: star.twinkles }"
      :style="star.twinkles ? { animationDelay: `${star.delay}ms` } : undefined"
    />

    <path d="M0 760 C 220 690 420 720 640 745 S 1100 700 1300 730 S 1520 720 1600 700 V1000 H0 Z" fill="#3a2150" />

    <g fill="#26183f" transform="translate(-440 0)">
      <rect x="1120" y="668" width="150" height="70" />
      <rect x="1180" y="620" width="30" height="60" />
      <path d="M1180 620 L1195 588 L1210 620 Z" />
      <rect x="1280" y="690" width="96" height="48" />
      <path d="M1280 690 L1328 662 L1376 690 Z" />
      <rect x="1010" y="684" width="96" height="54" />
      <path d="M1022 684 a36 36 0 0 1 72 0 Z" />
    </g>
    <g fill="#f5a623" transform="translate(-440 0)">
      <rect v-for="window in windows" :key="`${window[0]}-${window[1]}`" :x="window[0]" :y="window[1]" width="8" height="12" />
    </g>

    <path d="M0 830 C 200 760 460 770 700 800 S 1200 770 1600 790 V1000 H0 Z" fill="#1d1233" />

    <g fill="#120b22">
      <path d="M1420 800 l34 -100 l34 100 Z" />
      <path d="M1470 802 l26 -76 l26 76 Z" />
      <path d="M1520 800 l38 -118 l38 118 Z" />
      <path d="M60 790 l28 -84 l28 84 Z" />
      <path d="M100 786 l36 -112 l36 112 Z" />
      <path d="M0 880 C 240 800 520 800 760 860 S 1280 900 1600 840 V1000 H0 Z" />
    </g>

    <g fill="#07040f">
      <path d="M322 824 h10 l4 -60 h-18 Z" />
      <rect x="318" y="722" width="18" height="46" rx="6" />
      <circle cx="327" cy="708" r="11" />
      <path d="M332 732 l30 -14 l4 7 l-32 17 Z" />
      <path d="M372 716 l52 -30 l6 11 l-52 30 Z" />
      <path d="M392 712 l-16 112 h7 l14 -100 l14 100 h7 l-20 -112 Z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ align?: string }>(), { align: 'xMidYMax' })

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
}

const random = seeded(4817)
const round = (value: number) => Math.round(value * 100) / 100

const stars = Array.from({ length: 190 }, (_, id) => ({
  id,
  x: round(random() * 1600),
  y: round(random() * 640),
  size: round(0.7 + random() * 1.5),
  opacity: round(0.35 + random() * 0.65),
  twinkles: id % 6 === 0,
  delay: Math.round(random() * 4000),
}))

const windows = [
  [1136, 684], [1160, 684], [1216, 684], [1240, 684],
  [1136, 708], [1216, 708], [1240, 708], [1191, 640],
  [1300, 706], [1348, 706], [1028, 704], [1076, 704],
]
</script>

<style scoped>
.twinkle {
  animation: twinkle 4s var(--ease-weighted) infinite alternate;
}

@keyframes twinkle {
  to {
    opacity: 0.15;
  }
}

@media (prefers-reduced-motion: reduce) {
  .twinkle {
    animation: none;
  }
}
</style>

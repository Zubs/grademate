<template>
  <figure class="flex flex-col gap-4" aria-label="Interactive GradeMate preview with sample data">
    <svg
      class="w-full"
      viewBox="0 0 560 300"
      role="img"
      :aria-label="`Stars charting GPA by semester: ${semesters.map(semester => semester.gpa).join(', ')}, rising toward a target of ${target.toFixed(2)}.`"
    >
      <polyline :points="linePoints" fill="none" stroke="#fff6e0" stroke-width="1.5" opacity="0.7" />
      <line
        :x1="lastPoint.x"
        :y1="lastPoint.y"
        :x2="targetX"
        :y2="targetY"
        stroke="#f5a623"
        stroke-width="2"
        stroke-dasharray="4 8"
        stroke-linecap="round"
      />
      <g v-for="(point, index) in points" :key="point.label" class="semester-star" :style="{ animationDelay: `${index * 160}ms` }" data-preview="bar">
        <circle :cx="point.x" :cy="point.y" r="12" fill="#fff6e0" opacity="0.15" />
        <circle :cx="point.x" :cy="point.y" r="5" fill="#fff6e0" />
        <text :x="point.x" :y="point.y + 30" text-anchor="middle" fill="#fff6e0" font-size="14" font-weight="500" class="tabular">{{ point.gpa.toFixed(2) }}</text>
      </g>
      <g class="target-star" :style="{ transform: `translate(${targetX}px, ${targetY}px)` }">
        <circle r="30" fill="#f5a623" opacity="0.18" />
        <path d="M0 -24 L5 -5 L24 0 L5 5 L0 24 L-5 5 L-24 0 L-5 -5 Z" fill="#f5a623" />
        <text y="-34" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="600" class="tabular" data-preview="target">{{ target.toFixed(2) }}</text>
      </g>
    </svg>

    <div class="rounded-2xl border border-line-strong bg-black/50 p-4 backdrop-blur-md tablet:p-6">
      <dl class="flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <dt class="caption-2 text-ink-soft">Current CGPA</dt>
          <dd class="title-2 tabular" data-preview="cgpa">{{ cgpa }}</dd>
        </div>
        <div>
          <dt class="caption-2 text-ink-soft">Credits</dt>
          <dd class="title-2 tabular">{{ credits }}</dd>
        </div>
        <div>
          <dt class="caption-2 text-ink-soft">Semesters</dt>
          <dd class="title-2 tabular" data-preview="semester-count">{{ semesters.length }}</dd>
        </div>
      </dl>

      <label class="title-4 mt-4 block" :for="sliderId">Move your target star</label>
      <input
        :id="sliderId"
        v-model.number="target"
        class="mt-2 w-full accent-[var(--accent-fill)]"
        type="range"
        :min="floor"
        :max="ceiling"
        step="0.01"
      >

      <div class="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2" aria-live="polite">
        <div>
          <p class="caption-2 text-ink-soft">Average needed over your next {{ upcomingCredits }} credits</p>
          <p class="heading-4 tabular" data-preview="needed">{{ neededLabel }}</p>
        </div>
        <p class="body-5 inline-flex items-center gap-2" :class="status.tone">
          <component :is="status.icon" :size="16" weight="bold" aria-hidden="true" />
          {{ status.label }}
        </p>
      </div>
      <figcaption class="caption-5 mt-2 text-ink-soft">Sample student record, for illustration.</figcaption>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { PhCheckCircle, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue'

const semesters = [
  { label: 'Year 1, first semester', gpa: 3.2, credits: 18 },
  { label: 'Year 1, second semester', gpa: 3.41, credits: 18 },
  { label: 'Year 2, first semester', gpa: 3.68, credits: 18 },
  { label: 'Year 2, second semester', gpa: 3.77, credits: 18 },
]

const floor = 3
const ceiling = 4
const upcomingCredits = 30
const sliderId = useId()
const target = ref(3.6)

const chartBottom = 250
const chartTop = 50
const yFor = (gpa: number) => chartBottom - ((gpa - floor) / (ceiling - floor)) * (chartBottom - chartTop)

const points = semesters.map((semester, index) => ({
  ...semester,
  x: 40 + index * 110,
  y: yFor(semester.gpa),
}))
const lastPoint = points[points.length - 1]!
const linePoints = points.map(point => `${point.x},${point.y}`).join(' ')
const targetX = 500
const targetY = computed(() => yFor(target.value))

const credits = semesters.reduce((total, semester) => total + semester.credits, 0)
const earnedPoints = semesters.reduce((total, semester) => total + semester.gpa * semester.credits, 0)
const cgpa = (earnedPoints / credits).toFixed(2)

const needed = computed(() => (target.value * (credits + upcomingCredits) - earnedPoints) / upcomingCredits)
const neededLabel = computed(() => Math.max(needed.value, 0).toFixed(2))

const status = computed(() => {
  if (needed.value > 4) {
    return { label: 'Out of reach in 30 credits', tone: 'text-negative', icon: PhXCircle }
  }

  if (needed.value >= 3.6) {
    return { label: 'A stretch, but possible', tone: 'text-accent-ink', icon: PhWarningCircle }
  }

  return { label: 'Within reach', tone: 'text-positive', icon: PhCheckCircle }
})
</script>

<style scoped>
.semester-star {
  animation: appear 700ms var(--ease-weighted) both;
}

.target-star {
  transition: transform 500ms var(--ease-weighted);
}

@keyframes appear {
  from {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .semester-star {
    animation: none;
  }

  .target-star {
    transition: none;
  }
}
</style>

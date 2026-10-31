<template>
  <div>
    <div v-if="!academic.years.length" class="mx-auto flex max-w-hero flex-col items-center py-24 text-center">
      <PhGraduationCap :size="48" class="text-accent-ink" aria-hidden="true" />
      <h1 class="heading-4 mt-4">Let's set up your academic record</h1>
      <p class="body-3 mt-2 text-ink-soft">Add your first academic year and semester to start tracking your GPA.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <NuxtLink to="/dashboard/semesters" class="button button-primary">Add your first semester</NuxtLink>
        <button type="button" class="button button-secondary" @click="loadDemo">Load demo data</button>
      </div>
    </div>

    <div v-else class="mx-auto flex max-w-6xl flex-col gap-8">
      <section class="grid items-center gap-8 tablet:grid-cols-2">
        <div>
          <p class="body-6 text-ink-soft">Good {{ timeOfDay }},</p>
          <h1 class="heading-3">{{ auth.user?.name?.split(' ')[0] }}</h1>
        </div>
        <div class="flex items-center gap-6 tablet:justify-end">
          <div class="relative size-32 shrink-0">
            <svg class="size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" :r="ringRadius" fill="none" stroke="var(--overlay)" stroke-width="8" />
              <circle
                cx="60"
                cy="60"
                :r="ringRadius"
                fill="none"
                stroke="var(--accent-fill)"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="ringLength"
                :stroke-dashoffset="ringOffset"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="heading-5 tabular">{{ academic.cgpa.toFixed(2) }}</span>
              <span class="caption-5 text-ink-soft">CGPA</span>
            </div>
          </div>
          <div>
            <span class="tag" :class="classificationBadge">{{ classification }}</span>
            <p class="caption-2 mt-2 text-ink-soft">out of {{ academic.maxPoints.toFixed(1) }}, {{ scaleLabel }}</p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-4 tablet:grid-cols-4" aria-label="Summary">
        <div v-for="stat in stats" :key="stat.name" class="panel p-4">
          <component :is="stat.icon" :size="24" class="text-accent-ink" aria-hidden="true" />
          <p class="heading-5 tabular mt-2">{{ stat.value }}</p>
          <p class="caption-2 text-ink-soft">{{ stat.name }}</p>
        </div>
      </section>

      <section class="panel p-4 tablet:p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="heading-6">GPA progression</h2>
            <p class="caption-2 text-ink-soft">Results by semester</p>
          </div>
          <span class="body-5 tabular inline-flex items-center gap-1" :class="trendClass">
            <PhTrendUp v-if="trend >= 0" :size="16" weight="bold" aria-hidden="true" />
            <PhTrendDown v-else :size="16" weight="bold" aria-hidden="true" />
            {{ Math.abs(trend).toFixed(2) }} vs last semester
          </span>
        </div>
        <div class="mt-4 h-64">
          <canvas ref="chartCanvas" role="img" aria-label="Line chart of GPA by semester" />
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between gap-4">
          <h2 class="heading-6">Recent semesters</h2>
          <NuxtLink to="/dashboard/semesters" class="text-link body-5">View all</NuxtLink>
        </div>
        <ul class="panel mt-4 overflow-hidden">
          <li v-for="sem in recentSemesters" :key="sem.id" class="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line p-4 last:border-0">
            <div class="min-w-0 flex-1">
              <p class="title-4">{{ sem.name }}</p>
              <p class="caption-5 text-ink-muted">{{ sem.year }}</p>
            </div>
            <span class="caption-2 text-ink-soft">{{ sem.courses.length }} courses</span>
            <span class="caption-2 text-ink-soft">{{ sem.totalCredits }} credits</span>
            <span class="body-4 tabular" :class="gpaClass(sem.gpa)">{{ sem.gpa.toFixed(2) }}</span>
          </li>
        </ul>
      </section>

      <section class="grid gap-4 tablet:grid-cols-3" aria-label="Quick actions">
        <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to" class="quick-action panel flex items-center gap-3 p-4">
          <component :is="action.icon" :size="24" class="text-accent-ink" aria-hidden="true" />
          <span class="title-4 flex-1">{{ action.label }}</span>
          <PhCaretRight :size="16" class="text-ink-muted" aria-hidden="true" />
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhBookOpen, PhCalendarBlank, PhCaretRight, PhCertificate, PhGear, PhGraduationCap, PhPlus, PhRanking, PhTarget, PhTrendDown, PhTrendUp } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const colorMode = useColorMode()
const academic = useAcademicStore()
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: { destroy: () => void } | null = null

function loadDemo() {
  academic.loadDemo()
}

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  if (h < 12) {
    return 'morning'
  }

  if (h < 17) {
    return 'afternoon'
  }

  return 'evening'
})

const totalSemesters = computed(() =>
    academic.years.reduce((s, y) => s + y.semesters.length, 0)
)

const allSemesters = computed(() =>
    academic.years.flatMap(y => y.semesters.map(s => ({ ...s, year: y.label })))
)

const recentSemesters = computed(() => allSemesters.value.slice(-4).reverse())

const bestSemesterGPA = computed(() => {
  const gpas = allSemesters.value.map(s => s.gpa)
  return gpas.length ? Math.max(...gpas).toFixed(2) : '—'
})

const trend = computed(() => {
  const hist = academic.semesterHistory
  if (hist.length < 2) {
    return 0
  }

  return hist[hist.length - 1].gpa - hist[hist.length - 2].gpa
})
const trendClass = computed(() => trend.value >= 0 ? 'text-positive' : 'text-negative')

const stats = computed(() => [
  { name: 'Total credits', value: academic.totalCredits, icon: PhBookOpen },
  { name: 'Courses completed', value: academic.completedCourses, icon: PhCertificate },
  { name: 'Semesters', value: totalSemesters.value, icon: PhCalendarBlank },
  { name: 'Best semester GPA', value: bestSemesterGPA.value, icon: PhRanking },
])

const quickActions = [
  { to: '/dashboard/semesters', label: 'Add semester', icon: PhPlus },
  { to: '/dashboard/forecast', label: 'Run forecast', icon: PhTarget },
  { to: '/dashboard/settings', label: 'Settings', icon: PhGear },
]

const scaleLabel = computed(() => ({
  '4.0': '4.0 Scale', '5.0': '5.0 Scale', 'uk': 'UK Classification',
}[academic.gradingScale]))

const classification = computed(() => {
  const c = academic.cgpa
  const s = academic.gradingScale
  if (s === 'uk') {
    if (c >= 3.7) {
      return 'First Class'
    }

    if (c >= 3.0) {
      return 'Upper Second'
    }

    if (c >= 2.7) {
      return 'Lower Second'
    }

    if (c >= 2.0) {
      return 'Third Class'
    }

    return 'Fail'
  }
  const max = s === '5.0' ? 5 : 4
  const pct = c / max
  if (pct >= 0.9) {
    return 'First Class'
  }

  if (pct >= 0.8) {
    return 'Second Class Upper'
  }

  if (pct >= 0.7) {
    return 'Second Class Lower'
  }

  if (pct >= 0.6) {
    return 'Third Class'
  }

  if (pct >= 0.4) {
    return 'Pass'
  }

  return 'Fail'
})

const classificationBadge = computed(() => {
  if (['First Class'].includes(classification.value)) {
    return 'tag-positive'
  }

  if (['Second Class Upper', 'Upper Second'].includes(classification.value)) {
    return 'tag-accent'
  }

  return 'tag'
})

const ringRadius = 54
const ringLength = 2 * Math.PI * ringRadius
const ringOffset = computed(() => ringLength * (1 - academic.cgpa / academic.maxPoints))

function gpaClass(gpa: number) {
  const pct = gpa / academic.maxPoints
  if (pct >= 0.85) {
    return 'text-positive'
  }

  if (pct >= 0.7) {
    return 'text-accent-ink'
  }

  return 'text-ink-soft'
}

// Chart
async function renderChart() {
  if (!chartCanvas.value || !academic.semesterHistory.length) {
    return
  }

  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  if (chartInstance) {
    chartInstance.destroy()
  }

  const hist = academic.semesterHistory
  const style = getComputedStyle(document.documentElement)
  const token = (name: string) => style.getPropertyValue(name).trim()
  const accent = token('--accent-fill')
  const gridColor = token('--line')
  const labelColor = token('--ink-soft')

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: hist.map(h => h.label),
      datasets: [{
        label: 'GPA',
        data: hist.map(h => h.gpa),
        borderColor: accent,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointBackgroundColor: accent,
        pointBorderColor: token('--surface'),
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.35,
        fill: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }, tooltip: {
          backgroundColor: token('--raised'),
          titleColor: token('--ink'),
          bodyColor: token('--ink-soft'),
          borderColor: token('--line'),
          borderWidth: 1, padding: 10, cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { family: 'Geist', size: 12 }}
        },
        y: {
          min: 0, max: academic.maxPoints,
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { family: 'Geist', size: 12 }, stepSize: 1 },
        },
      },
    },
  })
}

onMounted(() => {
  nextTick(renderChart)
})
watch(() => academic.semesterHistory, () => nextTick(renderChart), { deep: true })
watch(() => colorMode.value, () => nextTick(renderChart))
</script>

<style scoped>
.quick-action {
  transition: border-color 300ms var(--ease-weighted);
}

.quick-action:hover {
  border-color: var(--line-strong);
}
</style>

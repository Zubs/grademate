<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8">
    <div>
      <h1 class="heading-4">Target forecaster</h1>
      <p class="body-6 mt-1 text-ink-soft">Find out exactly what grades you need to reach your goal.</p>
    </div>

    <dl class="panel grid grid-cols-2 gap-4 p-4 tablet:grid-cols-4 tablet:p-6">
      <div>
        <dt class="caption-2 text-ink-soft">Current CGPA</dt>
        <dd class="heading-5 tabular text-accent-ink">{{ academic.cgpa.toFixed(2) }}</dd>
      </div>
      <div>
        <dt class="caption-2 text-ink-soft">Credits earned</dt>
        <dd class="heading-5 tabular">{{ academic.totalCredits }}</dd>
      </div>
      <div>
        <dt class="caption-2 text-ink-soft">Classification</dt>
        <dd class="title-3 mt-1">{{ classification }}</dd>
      </div>
      <div>
        <dt class="caption-2 text-ink-soft">Scale</dt>
        <dd class="title-3 mt-1">{{ scaleLabel }}</dd>
      </div>
    </dl>

    <div class="grid items-start gap-8 tablet:grid-cols-2">
      <section class="panel flex flex-col gap-6 p-4 tablet:p-6">
        <h2 class="heading-6">Set your target</h2>

        <div class="flex flex-col gap-2">
          <label class="field-label" for="target-cgpa">Target CGPA</label>
          <input
            id="target-cgpa"
            v-model.number="targetCGPA"
            type="number"
            class="field tabular"
            :min="0"
            :max="academic.maxPoints"
            :step="0.01"
            :placeholder="`0.00 to ${academic.maxPoints.toFixed(2)}`"
          >
          <p v-if="targetCGPA" class="caption-2 text-ink-soft">
            That puts you in
            <span class="tag" :class="targetBadge">{{ targetClassification }}</span>
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="field-label" for="upcoming-credits">Upcoming credits</label>
          <input id="upcoming-credits" v-model.number="upcomingCredits" type="number" class="field tabular" min="1" max="300" placeholder="60">
          <span class="caption-5 text-ink-muted">Total credit units you'll take going forward.</span>
        </div>

        <div>
          <p class="field-label">Quick targets</p>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <button
              v-for="t in quickTargets"
              :key="t.label"
              type="button"
              class="button button-small"
              :class="targetCGPA === t.value ? 'button-primary' : 'button-secondary'"
              @click="targetCGPA = t.value"
            >
              <span class="tabular">{{ t.value }}</span>
              <span class="caption-5">{{ t.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="panel p-4 tablet:p-6" aria-live="polite">
        <div v-if="!result" class="flex flex-col items-center py-16 text-center">
          <PhTarget :size="48" class="text-ink-muted" aria-hidden="true" />
          <p class="body-3 mt-4 text-ink-soft">Fill in your target to see the forecast.</p>
        </div>
        <template v-else>
          <p class="body-6 text-ink-soft">You need an average GPA of</p>
          <p class="heading-2 tabular mt-1">{{ result.toFixed(2) }}</p>
          <p class="caption-2 text-ink-soft">across {{ upcomingCredits }} credits</p>
          <p v-if="resultStatus" class="body-5 mt-4 inline-flex items-center gap-2" :class="resultStatus.tone">
            <component :is="resultStatus.icon" :size="16" weight="bold" aria-hidden="true" />
            {{ resultStatus.label }}
          </p>

          <div class="mt-6 border-t border-line pt-4">
            <p class="title-4">What that looks like per course</p>
            <ul class="mt-2 flex flex-col gap-2">
              <li v-for="g in gradeGuide" :key="g.grade" class="flex items-center gap-3">
                <span class="caption-2 w-32 shrink-0 truncate text-ink-soft">{{ g.grade }}</span>
                <span class="h-2 flex-1 overflow-hidden rounded bg-overlay">
                  <span class="block h-full rounded" :class="g.points >= result ? 'bg-positive' : 'bg-negative'" :style="{ width: `${g.points / academic.maxPoints * 100}%` }" />
                </span>
                <span class="caption-2 tabular w-8 text-right">{{ g.points.toFixed(1) }}</span>
                <PhCheck v-if="g.points >= result" :size="16" class="text-positive" aria-label="Meets the target" />
                <PhX v-else :size="16" class="text-negative" aria-label="Below the target" />
              </li>
            </ul>
          </div>
        </template>
      </section>
    </div>

    <section v-if="targetCGPA && upcomingCredits" class="panel overflow-hidden">
      <div class="p-4 tablet:p-6">
        <h2 class="heading-6">Scenarios</h2>
        <p class="caption-2 mt-1 text-ink-soft">How different upcoming GPAs affect your final CGPA</p>
      </div>
      <div class="overflow-x-auto" tabindex="0" role="region" aria-label="Forecast scenarios">
        <table class="w-full text-left">
          <thead>
            <tr class="caption-4 border-t border-line text-ink-soft">
              <th scope="col" class="px-4 py-2 font-medium tablet:px-6">Upcoming GPA</th>
              <th scope="col" class="px-4 py-2 font-medium">Resulting CGPA</th>
              <th scope="col" class="px-4 py-2 font-medium tablet:px-6">Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="scen in scenarios" :key="scen.upcoming" class="border-t border-line" :class="{ 'bg-raised': scen.upcoming === result }">
              <td class="body-6 tabular px-4 py-2 tablet:px-6">{{ scen.upcoming.toFixed(2) }}</td>
              <td class="body-4 tabular px-4 py-2" :class="cgpaClass(scen.cgpa)">{{ scen.cgpa.toFixed(2) }}</td>
              <td class="body-6 px-4 py-2 text-ink-soft tablet:px-6">{{ scen.classification }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PhCheck, PhCheckCircle, PhTarget, PhWarning, PhX, PhXCircle } from '@phosphor-icons/vue'
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const academic = useAcademicStore()
const targetCGPA = ref<number | ''>('')
const upcomingCredits = ref<number | ''>(60)

const result = computed(() => {
  if (!targetCGPA.value || !upcomingCredits.value) {
    return null
  }

  return academic.forecastRequiredGPA(+targetCGPA.value, +upcomingCredits.value)
})

const resultStatus = computed(() => {
  if (!result.value) {
    return null
  }

  if (result.value > academic.maxPoints) {
    return { label: 'Target not achievable at this scale', tone: 'text-negative', icon: PhXCircle }
  }

  if (result.value <= 0) {
    return { label: 'You have already reached this target', tone: 'text-positive', icon: PhCheckCircle }
  }

  if (result.value >= academic.maxPoints * 0.9) {
    return { label: 'A stretch goal, so stay focused', tone: 'text-accent-ink', icon: PhWarning }
  }

  return { label: 'Within reach, so keep going', tone: 'text-positive', icon: PhCheckCircle }
})

const scaleLabel = computed(() => ({
  '4.0': '4.0 Scale', '5.0': '5.0 Scale', 'uk': 'UK Classification',
}[academic.gradingScale]))

function classify(cgpa: number) {
  const s = academic.gradingScale
  if (s === 'uk') {
    if (cgpa >= 3.7) {
      return 'First Class'
    }

    if (cgpa >= 3.0) {
      return 'Upper Second'
    }

    if (cgpa >= 2.7) {
      return 'Lower Second'
    }

    if (cgpa >= 2.0) {
      return 'Third Class'
    }

    return 'Fail'
  }

  const pct = cgpa / academic.maxPoints
  if (pct >= 0.9) {
    return 'First Class'
  }

  if (pct >= 0.8) {
    return '2nd Class Upper'
  }

  if (pct >= 0.7) {
    return '2nd Class Lower'
  }

  if (pct >= 0.6) {
    return 'Third Class'
  }

  if (pct >= 0.4) {
    return 'Pass'
  }

  return 'Fail'
}

const classification = computed(() => classify(academic.cgpa))
const targetClassification = computed(() => targetCGPA.value ? classify(+targetCGPA.value) : '')

const targetBadge = computed(() => {
  const c = targetClassification.value
  if (c === 'First Class') {
    return 'tag-positive'
  }

  if (['2nd Class Upper', 'Upper Second'].includes(c)) {
    return 'tag-accent'
  }

  return 'tag'
})

const quickTargets = computed(() => {
  const max = academic.maxPoints
  return [
    { label: 'First Class', value: parseFloat((max * 0.9).toFixed(2)) },
    { label: '2nd Upper', value: parseFloat((max * 0.8).toFixed(2)) },
    { label: '2nd Lower', value: parseFloat((max * 0.7).toFixed(2)) },
    { label: 'Third', value: parseFloat((max * 0.6).toFixed(2)) },
  ]
})

const gradeGuide = computed(() => academic.scaleGrades)

function cgpaClass(cgpa: number) {
  const pct = cgpa / academic.maxPoints
  if (pct >= 0.85) {
    return 'text-positive'
  }

  if (pct >= 0.7) {
    return 'text-accent-ink'
  }

  return 'text-ink-soft'
}

const scenarios = computed(() => {
  if (!targetCGPA.value || !upcomingCredits.value) {
    return []
  }

  const cur = academic.cgpa
  const curCredits = academic.totalCredits
  const upcoming = +upcomingCredits.value
  const step = academic.maxPoints / 10
  return Array.from({ length: 11 }, (_, i) => {
    const upcomingGPA = parseFloat((i * step).toFixed(2))
    const total = curCredits + upcoming
    const cgpa = total ? Math.round(((cur * curCredits + upcomingGPA * upcoming) / total) * 100) / 100 : 0
    return {
      upcoming: upcomingGPA,
      cgpa,
      classification: classify(cgpa)
    }
  }).reverse()
})
</script>

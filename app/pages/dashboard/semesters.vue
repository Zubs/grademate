<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="heading-4">Semesters</h1>
        <p class="body-6 mt-1 text-ink-soft">Manage your academic years, semesters, and courses.</p>
      </div>
      <button type="button" class="button button-primary" @click="showAddYear = true">
        <PhPlus :size="16" weight="bold" aria-hidden="true" />
        Add academic year
      </button>
    </div>

    <div v-if="!academic.years.length" class="flex flex-col items-center py-16 text-center">
      <PhBooks :size="48" class="text-accent-ink" aria-hidden="true" />
      <h2 class="heading-5 mt-4">No academic years yet</h2>
      <p class="body-3 mt-2 text-ink-soft">Add your first academic year to begin organizing your semesters and courses.</p>
    </div>

    <section v-for="year in academic.years" :key="year.id" class="flex min-w-0 flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-baseline gap-3">
          <h2 class="heading-6 tabular">{{ year.label }}</h2>
          <span class="caption-2 text-ink-soft">{{ year.semesters.length }} semester{{ year.semesters.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="button button-secondary button-small" @click="openAddSemester(year.id)">
            <PhPlus :size="16" aria-hidden="true" />
            Add semester
          </button>
          <button type="button" class="icon-button hover:text-negative" title="Remove year" aria-label="Remove year" @click="confirmRemoveYear(year.id)">
            <PhTrash :size="16" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p v-if="!year.semesters.length" class="body-6 rounded-2xl border border-dashed border-line-strong p-4 text-ink-soft">
        No semesters yet. Use "Add semester" to create the first one.
      </p>

      <article v-for="sem in year.semesters" :key="sem.id" class="panel min-w-0 overflow-hidden">
        <div class="flex items-center gap-2 p-2">
          <button
            type="button"
            class="semester-toggle flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 rounded-lg p-2 text-left"
            :aria-expanded="expandedSem === sem.id"
            @click="toggleSem(sem.id)"
          >
            <span class="title-3">{{ sem.name }}</span>
            <span class="caption-2 text-ink-soft">{{ sem.courses.length }} courses</span>
            <span class="caption-2 text-ink-soft">{{ sem.totalCredits }} credits</span>
            <span class="body-5 tabular" :class="gpaClass(sem.gpa)">{{ sem.gpa.toFixed(2) }} GPA</span>
            <PhCaretDown class="semester-caret ml-auto text-ink-muted" :class="{ 'rotate-180': expandedSem === sem.id }" :size="16" aria-hidden="true" />
          </button>
          <button type="button" class="icon-button hover:text-negative" :aria-label="`Remove ${sem.name}`" @click="academic.removeSemester(year.id, sem.id)">
            <PhTrash :size="16" aria-hidden="true" />
          </button>
        </div>

        <div v-if="expandedSem === sem.id" class="border-t border-line">
          <div class="relative overflow-x-auto" tabindex="0" role="region" :aria-label="`${sem.name} courses`">
            <table class="w-full min-w-2xl text-left">
              <thead>
                <tr class="caption-4 text-ink-soft">
                  <th scope="col" class="px-4 py-2 font-medium">Course name</th>
                  <th scope="col" class="px-2 py-2 font-medium">Code</th>
                  <th scope="col" class="px-2 py-2 text-right font-medium">Credits</th>
                  <th scope="col" class="px-2 py-2 text-right font-medium">Grade</th>
                  <th scope="col" class="px-2 py-2 text-right font-medium">Points</th>
                  <th scope="col" class="px-2 py-2"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in sem.courses" :key="course.id" class="border-t border-line">
                  <td class="px-4 py-2">
                    <input v-model="course.name" class="field" placeholder="e.g. Algorithms" aria-label="Course name" @change="saveCourse(year.id, sem.id, course)">
                  </td>
                  <td class="px-2 py-2">
                    <input v-model="course.code" class="field w-24" placeholder="CSC301" aria-label="Course code" @change="saveCourse(year.id, sem.id, course)">
                  </td>
                  <td class="px-2 py-2 text-right">
                    <input v-model.number="course.credits" type="number" min="1" max="12" class="field tabular ml-auto w-16 text-right" aria-label="Credits" @change="saveCourse(year.id, sem.id, course)">
                  </td>
                  <td class="px-2 py-2 text-right">
                    <select v-model="course.grade" class="field ml-auto w-40" aria-label="Grade" @change="onGradeChange(year.id, sem.id, course)">
                      <option value="">No grade</option>
                      <option v-for="g in academic.scaleGrades" :key="g.grade" :value="g.grade">{{ g.grade }}</option>
                    </select>
                  </td>
                  <td class="body-5 tabular px-2 py-2 text-right" :class="gpaClass(course.gradePoints)">{{ course.gradePoints.toFixed(1) }}</td>
                  <td class="px-2 py-2 text-right">
                    <button type="button" class="icon-button hover:text-negative" :aria-label="`Remove ${course.name || 'course'}`" @click="academic.removeCourse(year.id, sem.id, course.id)">
                      <PhTrash :size="16" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line p-4">
            <button type="button" class="button button-secondary button-small" @click="addCourse(year.id, sem.id)">
              <PhPlus :size="16" aria-hidden="true" />
              Add course
            </button>
            <p class="caption-2 text-ink-soft">
              Semester GPA
              <strong class="body-4 tabular ml-2" :class="gpaClass(sem.gpa)">{{ sem.gpa.toFixed(2) }}</strong>
            </p>
          </div>
        </div>
      </article>
    </section>

    <AppDialog :open="showAddYear" title="Add academic year" description="Enter the academic year label, such as 2023/2024." @close="showAddYear = false">
      <form class="flex flex-col gap-4" @submit.prevent="addYear">
        <div class="flex flex-col gap-2">
          <label class="field-label" for="year-label">Year label</label>
          <input id="year-label" v-model="newYearLabel" class="field" placeholder="2024/2025" autofocus>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="button button-secondary" @click="showAddYear = false">Cancel</button>
          <button type="submit" class="button button-primary" :disabled="!newYearLabel.trim()">Add year</button>
        </div>
      </form>
    </AppDialog>

    <AppDialog :open="!!addSemFor" title="Add semester" description="Choose a semester to add to this academic year." @close="addSemFor = null">
      <div class="flex gap-2" role="group" aria-label="Semester">
        <button
          v-for="s in seasons"
          :key="s"
          type="button"
          class="button flex-1"
          :class="newSeason === s ? 'button-primary' : 'button-secondary'"
          :aria-pressed="newSeason === s"
          @click="newSeason = s"
        >
          {{ s }}
        </button>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <button type="button" class="button button-secondary" @click="addSemFor = null">Cancel</button>
        <button type="button" class="button button-primary" @click="addSemester">Add semester</button>
      </div>
    </AppDialog>

    <ConfirmDialog
      ref="removeYearDialog"
      title="Remove this academic year?"
      message="This also removes all its semesters and courses."
      confirm-label="Remove year"
    />
  </div>
</template>

<script setup lang="ts">
import { PhBooks, PhCaretDown, PhPlus, PhTrash } from '@phosphor-icons/vue'
import { useAcademicStore } from '~/stores/academic'
import type { Course } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const academic = useAcademicStore()
const expandedSem = ref<string | null>(null)
const showAddYear = ref(false)
const newYearLabel = ref('')
const addSemFor = ref<string | null>(null)
const newSeason = ref<'First' | 'Second' | 'Summer'>('First')
const seasons = ['First', 'Second', 'Summer'] as const

function toggleSem(id: string) {
  expandedSem.value = expandedSem.value === id ? null : id
}

function addYear() {
  if (!newYearLabel.value.trim()) {
    return
  }

  academic.addYear(newYearLabel.value.trim())
  newYearLabel.value = ''
  showAddYear.value = false
}

function openAddSemester(yearId: string) {
  addSemFor.value = yearId
  newSeason.value = 'First'
}

function addSemester() {
  if (!addSemFor.value) {
    return
  }

  const sem = academic.addSemester(addSemFor.value, newSeason.value)
  addSemFor.value = null
  if (sem) {
    nextTick(() => {
      expandedSem.value = sem.id
    })
  }
}

function addCourse(yearId: string, semId: string) {
  academic.upsertCourse(yearId, semId, {})
}

function onGradeChange(yearId: string, semId: string, course: Course) {
  const gradeData = academic.scaleGrades.find(g => g.grade === course.grade)
  course.gradePoints = gradeData?.points ?? 0
  academic.upsertCourse(yearId, semId, { ...course })
}

function saveCourse(yearId: string, semId: string, course: Course) {
  academic.upsertCourse(yearId, semId, { ...course })
}

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

const removeYearDialog = ref<{ ask: () => Promise<boolean> } | null>(null)

async function confirmRemoveYear(yearId: string) {
  if (await removeYearDialog.value?.ask()) {
    academic.removeYear(yearId)
  }
}
</script>

<style scoped>
@reference '~/assets/css/main.css';

.icon-button {
  @apply flex size-10 shrink-0 items-center justify-center rounded-lg text-ink-soft;
  transition: background-color 300ms var(--ease-weighted), color 300ms var(--ease-weighted);
}

.icon-button:hover {
  @apply bg-raised;
}

.semester-toggle {
  transition: background-color 300ms var(--ease-weighted);
}

.semester-toggle:hover {
  @apply bg-raised;
}

.semester-caret {
  transition: transform 500ms var(--ease-weighted);
}
</style>

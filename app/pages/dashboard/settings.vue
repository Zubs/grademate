<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8">
    <div>
      <h1 class="heading-4">Settings</h1>
      <p class="body-6 mt-1 text-ink-soft">Manage your profile, grading scale, and data.</p>
    </div>

    <div class="grid items-start gap-8 tablet:grid-cols-2">
      <div class="flex flex-col gap-8">
        <section class="panel flex flex-col gap-4 p-4 tablet:p-6">
          <h2 class="heading-6">Profile</h2>
          <div class="flex items-center gap-3">
            <span class="body-4 flex size-12 items-center justify-center rounded-lg bg-accent text-on-accent">{{ auth.user?.avatarInitials }}</span>
            <div class="min-w-0">
              <p class="title-4 truncate">{{ auth.user?.name }}</p>
              <p class="caption-5 truncate text-ink-muted">{{ auth.user?.email }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="field-label" for="profile-name">Full name</label>
            <input id="profile-name" v-model="profile.name" class="field" placeholder="Your name">
          </div>
          <div class="flex flex-col gap-2">
            <label class="field-label" for="profile-email">Email address</label>
            <input id="profile-email" v-model="profile.email" type="email" class="field" placeholder="you@university.edu">
          </div>
          <div class="flex flex-col gap-2">
            <label class="field-label" for="profile-institution">Institution (optional)</label>
            <input id="profile-institution" v-model="profile.institution" class="field" placeholder="University name">
          </div>
          <p v-if="profileSaved" class="body-5 inline-flex items-center gap-2 text-positive" role="status">
            <PhCheckCircle :size="16" weight="bold" aria-hidden="true" />
            Profile updated
          </p>
          <button type="button" class="button button-primary self-start" :disabled="profileSaving" @click="saveProfile">
            {{ profileSaving ? 'Saving' : 'Save profile' }}
          </button>
        </section>

        <section class="panel flex flex-col gap-4 p-4 tablet:p-6">
          <h2 class="heading-6">Appearance</h2>
          <div class="grid grid-cols-3 gap-2" role="group" aria-label="Theme">
            <button
              v-for="theme in themes"
              :key="theme.value"
              type="button"
              class="button button-small"
              :class="$colorMode.preference === theme.value ? 'button-primary' : 'button-secondary'"
              :aria-pressed="$colorMode.preference === theme.value"
              @click="$colorMode.preference = theme.value"
            >
              <component :is="theme.icon" :size="16" aria-hidden="true" />
              {{ theme.label }}
            </button>
          </div>
        </section>
      </div>

      <div class="flex flex-col gap-8">
        <section class="panel flex flex-col gap-4 p-4 tablet:p-6">
          <div>
            <h2 class="heading-6">Grading scale</h2>
            <p class="caption-2 mt-1 text-ink-soft">This affects how GPA points are calculated across all your semesters.</p>
          </div>
          <fieldset class="flex flex-col gap-2">
            <legend class="sr-only">Grading scale</legend>
            <label
              v-for="s in scales"
              :key="s.value"
              class="scale-option flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-3"
              :class="selectedScale === s.value ? 'border-accent-ink' : 'border-line'"
            >
              <span>
                <span class="title-4 block">{{ s.name }}</span>
                <span class="caption-5 text-ink-soft">{{ s.desc }}</span>
              </span>
              <input v-model="selectedScale" type="radio" :value="s.value" class="accent-[var(--accent-fill)]">
            </label>
          </fieldset>
          <p v-if="selectedScale !== academic.gradingScale" class="body-6 inline-flex items-start gap-2 text-accent-ink">
            <PhWarningCircle :size="16" class="mt-0.5 shrink-0" aria-hidden="true" />
            Changing scale will recalculate all GPAs. Your grades remain unchanged.
          </p>
          <button type="button" class="button button-primary self-start" :disabled="selectedScale === academic.gradingScale" @click="saveScale">
            Apply scale
          </button>
        </section>

        <section class="panel p-4 tablet:p-6">
          <h2 class="heading-6">Data</h2>
          <p class="caption-2 mt-1 text-ink-soft">Export or reset your academic data.</p>
          <div class="mt-2 flex flex-col">
            <div v-for="row in dataRows" :key="row.title" class="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
              <div>
                <p class="title-4" :class="{ 'text-negative': row.danger }">{{ row.title }}</p>
                <p class="caption-5 text-ink-soft">{{ row.detail }}</p>
              </div>
              <button type="button" class="button button-small" :class="row.danger ? 'button-danger' : 'button-secondary'" @click="row.action">
                {{ row.label }}
              </button>
            </div>
          </div>
        </section>

        <section class="panel flex items-center justify-between gap-4 p-4 tablet:p-6">
          <div>
            <h2 class="heading-6">Account</h2>
            <p class="caption-5 text-ink-soft">Sign out from this device.</p>
          </div>
          <button type="button" class="button button-secondary button-small" @click="logout">Sign out</button>
        </section>
      </div>
    </div>

    <ConfirmDialog
      ref="clearDialog"
      title="Clear all your data?"
      message="This permanently deletes all your semesters and courses."
      confirm-label="Clear data"
    />
  </div>
</template>

<script setup lang="ts">
import { PhCheckCircle, PhDesktop, PhMoon, PhSun, PhWarningCircle } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const academic = useAcademicStore()
const router = useRouter()

const profile = reactive({
  name: auth.user?.name ?? '',
  email: auth.user?.email ?? '',
  institution: auth.user?.institution ?? '',
})

const themes = [
  { value: 'dark', label: 'Dark', icon: PhMoon },
  { value: 'light', label: 'Light', icon: PhSun },
  { value: 'system', label: 'System', icon: PhDesktop },
]

const profileSaving = ref(false)
const profileSaved = ref(false)
const selectedScale = ref(academic.gradingScale)

const scales = [
  {
    value: '4.0',
    name: '4.0 Scale',
    desc: 'Standard US university system'
  },
  {
    value: '5.0',
    name: '5.0 Scale',
    desc: 'Common in Nigerian universities'
  },
  {
    value: 'uk',
    name: 'UK Classifications',
    desc: 'First, 2:1, 2:2, Third'
  },
]

async function saveProfile() {
  profileSaving.value = true
  await new Promise(r => setTimeout(r, 600))
  auth.updateUser({
    name: profile.name,
    email: profile.email,
    institution: profile.institution
  })
  profileSaving.value = false
  profileSaved.value = true
  setTimeout(() => {
    profileSaved.value = false
  }, 2500)
}

function saveScale() {
  academic.setScale(selectedScale.value)
}

function exportData() {
  const data = {
    years: academic.years,
    scale: academic.gradingScale,
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url;
  a.download = 'grademate-export.json';
  a.click()
  URL.revokeObjectURL(url)
}

const clearDialog = ref<{ ask: () => Promise<boolean> } | null>(null)

async function confirmClear() {
  if (await clearDialog.value?.ask()) {
    academic.years.splice(0)
    if (import.meta.client) {
      localStorage.removeItem('grademate_years')
    }
  }
}

const dataRows = [
  { title: 'Export data', detail: 'Download all your academic records as JSON.', label: 'Export', action: exportData, danger: false },
  { title: 'Load demo data', detail: 'Populate with sample courses and semesters.', label: 'Load demo', action: () => academic.loadDemo(), danger: false },
  { title: 'Clear all data', detail: 'Permanently delete all semesters and courses.', label: 'Clear', action: confirmClear, danger: true },
]

async function logout() {
  auth.logout()
  await router.push('/')
}
</script>

<style scoped>
.scale-option {
  transition: border-color 300ms var(--ease-weighted);
}

.scale-option:focus-within {
  outline: 2px solid var(--accent-ink);
  outline-offset: 2px;
}
</style>

<template>
  <AuthForm title="Create your account" subtitle="Free for every student. No credit card.">
    <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
      <div class="flex flex-col gap-2">
        <label class="field-label" for="name">Full name</label>
        <input id="name" v-model="form.name" type="text" class="field" placeholder="Your name" autocomplete="name" required :disabled="loading">
      </div>

      <div class="flex flex-col gap-2">
        <label class="field-label" for="email">Email address</label>
        <input id="email" v-model="form.email" type="email" class="field" placeholder="you@university.edu" autocomplete="email" required :disabled="loading">
      </div>

      <div class="flex flex-col gap-2">
        <label class="field-label" for="institution">Institution (optional)</label>
        <input id="institution" v-model="form.institution" type="text" class="field" placeholder="University of Lagos" :disabled="loading">
      </div>

      <div class="flex flex-col gap-2">
        <label class="field-label" for="scale">Grading scale</label>
        <select id="scale" v-model="form.scale" class="field" :disabled="loading">
          <option value="4.0">4.0 scale (US)</option>
          <option value="5.0">5.0 scale (Nigeria)</option>
          <option value="uk">UK degree classifications</option>
        </select>
        <span class="caption-5 text-ink-muted">You can change this at any time in Settings.</span>
      </div>

      <div class="flex flex-col gap-2">
        <PasswordField
          v-model="form.password"
          autocomplete="new-password"
          placeholder="At least 8 characters"
          :minlength="8"
          :disabled="loading"
        />
        <div v-if="form.password" class="flex items-center gap-2" data-strength>
          <div class="flex flex-1 gap-1">
            <span
              v-for="level in 4"
              :key="level"
              class="h-1 flex-1 rounded"
              :class="level <= strength.level ? strengthColor : 'bg-overlay'"
            />
          </div>
          <span class="caption-4 text-ink-soft">{{ strength.label }}</span>
        </div>
      </div>

      <p v-if="error" class="body-6 inline-flex items-center gap-2 text-negative" role="alert">
        <PhWarningCircle :size="16" aria-hidden="true" />
        {{ error }}
      </p>

      <button type="submit" class="button button-primary mt-2 w-full" :disabled="loading || strength.level < 1">
        {{ loading ? 'Creating account' : 'Create account' }}
      </button>

      <p class="caption-5 text-ink-muted">
        By creating an account you agree to our
        <NuxtLink to="/terms" class="text-link">terms</NuxtLink> and
        <NuxtLink to="/privacy" class="text-link">privacy policy</NuxtLink>.
      </p>
    </form>

    <p class="body-6 text-ink-soft">
      Already have an account?
      <NuxtLink to="/login" class="text-link">Sign in</NuxtLink>
    </p>
  </AuthForm>
</template>

<script setup lang="ts">
import { PhWarningCircle } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'
import type { GradingScale } from '~/stores/academic'

definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'Create your account | GradeMate' })

const auth = useAuthStore()
const academic = useAcademicStore()
const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  institution: '',
  scale: '4.0',
  password: '',
})
const loading = ref(false)
const error = ref('')

const strength = computed(() => {
  const password = form.password
  if (!password) {
    return { level: 0, label: '' }
  }

  let score = 0
  if (password.length >= 8) {
    score++
  }

  if (password.length >= 12) {
    score++
  }

  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
    score++
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++
  }

  return { level: score, label: ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score] }
})

const strengthColor = computed(() => {
  if (strength.value.level <= 1) {
    return 'bg-negative'
  }

  return strength.value.level === 4 ? 'bg-positive' : 'bg-accent'
})

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form.name, form.email, form.password, form.institution)
    academic.setScale(form.scale as GradingScale)
    await router.push('/dashboard')
  } catch {
    error.value = 'We could not create your account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

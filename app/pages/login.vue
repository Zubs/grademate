<template>
  <AuthForm title="Welcome back" subtitle="Sign in to continue tracking your grades.">
    <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
      <div class="flex flex-col gap-2">
        <label class="field-label" for="email">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="field"
          placeholder="you@university.edu"
          autocomplete="email"
          required
          :disabled="loading"
        >
      </div>

      <PasswordField v-model="form.password" autocomplete="current-password" :disabled="loading" />

      <p v-if="error" class="body-6 inline-flex items-center gap-2 text-negative" role="alert">
        <PhWarningCircle :size="16" aria-hidden="true" />
        {{ error }}
      </p>

      <button type="submit" class="button button-primary mt-2 w-full" :disabled="loading">
        {{ loading ? 'Signing in' : 'Sign in' }}
      </button>
    </form>

    <button type="button" class="button button-secondary w-full" :disabled="starting" @click="startDemo">
      Try with demo data
    </button>

    <p class="body-6 text-ink-soft">
      New to GradeMate?
      <NuxtLink to="/register" class="text-link">Create your free account</NuxtLink>
    </p>
  </AuthForm>
</template>

<script setup lang="ts">
import { PhWarningCircle } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'Sign in | GradeMate' })

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { starting, startDemo } = useDemo()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    const redirect = route.query.redirect as string || '/dashboard'
    await router.push(redirect)
  } catch {
    error.value = 'Sign in failed. Check your details and try again.'
  } finally {
    loading.value = false
  }
}
</script>

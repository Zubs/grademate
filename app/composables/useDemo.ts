import { useAcademicStore } from '~/stores/academic'
import { useAuthStore } from '~/stores/auth'

export function useDemo() {
  const auth = useAuthStore()
  const academic = useAcademicStore()
  const router = useRouter()
  const starting = ref(false)

  async function startDemo() {
    starting.value = true
    await auth.login('demo@student.edu', 'demo')
    academic.loadDemo()
    await router.push('/dashboard')
    starting.value = false
  }

  return { starting, startDemo }
}

import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

describe('auth store hydrate', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('restores a saved user', () => {
    localStorage.setItem('grademate_user', JSON.stringify({ name: 'Ada', email: 'ada@uni.edu' }))
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    auth.hydrate()
    expect(auth.user?.email).toBe('ada@uni.edu')
  })

  it('treats unreadable details as signed out and leaves them in place', () => {
    localStorage.setItem('grademate_user', '{broken')
    const auth = useAuthStore()
    auth.hydrate()
    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('grademate_user')).toBe('{broken')
  })
})

import { defineStore } from 'pinia'

export interface User {
    id: string
    name: string
    email: string
    institution?: string
    gradingScale: '4.0' | '5.0' | 'uk'
    avatarInitials: string
    createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isLoading = ref(false)

    // Hydrate from localStorage on client
    if (import.meta.client) {
        const stored = localStorage.getItem('grademate_user')
        if (stored) {
            try {
                user.value = JSON.parse(stored)
            } catch {
                user.value = null
            }
        }
    }

    const isAuthenticated = computed(() => !!user.value)

    function initials(name: string) {
        return name.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase().slice(0, 2)
    }

    async function login(email: string, _password: string) {
        isLoading.value = true
        await new Promise(r => setTimeout(r, 900))
        // Mock auth — replace with real API call
        const mockUser: User = {
            id: 'usr_' + Math.random().toString(36).slice(2),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            institution: '',
            gradingScale: '4.0',
            avatarInitials: initials(email.split('@')[0]),
            createdAt: new Date().toISOString(),
        }
        user.value = mockUser
        if (import.meta.client) {
            localStorage.setItem('grademate_user', JSON.stringify(mockUser))
        }

        isLoading.value = false
        return mockUser
    }

    async function register(
        name: string,
        email: string,
        _password: string,
        institution?: string
    ) {
        isLoading.value = true
        await new Promise(r => setTimeout(r, 900))
        const mockUser: User = {
            id: 'usr_' + Math.random().toString(36).slice(2),
            name,
            email,
            institution,
            gradingScale: '4.0',
            avatarInitials: initials(name),
            createdAt: new Date().toISOString(),
        }
        user.value = mockUser
        if (import.meta.client) {
            localStorage.setItem('grademate_user', JSON.stringify(mockUser))
        }

        isLoading.value = false
        return mockUser
    }

    function logout() {
        user.value = null
        if (import.meta.client) {
            localStorage.removeItem('grademate_user')
        }
    }

    function updateUser(updates: Partial<User>) {
        if (!user.value) {
            return
        }

        user.value = {
            ...user.value,
            ...updates,
            avatarInitials: initials(updates.name || user.value.name)
        }

        if (import.meta.client) {
            localStorage.setItem('grademate_user', JSON.stringify(user.value))
        }
    }

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
    }
})

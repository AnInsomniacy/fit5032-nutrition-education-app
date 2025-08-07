import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

export type UserRole = 'individual' | 'professional' | 'educator'

export interface User {
  id: string
  username: string
  name: string
  role: UserRole
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe: boolean
}

const STORAGE_KEY = 'nutrition_app_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const mockUsers: User[] = [
    {id: '1', username: 'admin', name: 'Administrator', role: 'professional'},
    {id: '2', username: 'user', name: 'Regular User', role: 'individual'},
    {id: '3', username: 'sarah@example.com', name: 'Sarah Chen', role: 'individual'},
    {id: '4', username: 'robert@example.com', name: 'Robert Thompson', role: 'individual'},
    {id: '5', username: 'maria@example.com', name: 'Maria Rodriguez', role: 'educator'},
    {id: '6', username: 'admin@example.com', name: 'Admin User', role: 'professional'}
  ]

  const mockPasswords: Record<string, string> = {
    'admin': 'admin',
    'user': 'user',
    'sarah@example.com': 'password123',
    'robert@example.com': 'password123',
    'maria@example.com': 'password123',
    'admin@example.com': 'password123'
  }

  const initializeAuth = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800))

    const foundUser = mockUsers.find(u => u.username === credentials.username)
    const validPassword = mockPasswords[credentials.username] === credentials.password

    if (!foundUser || !validPassword) {
      throw new Error('Invalid credentials')
    }

    user.value = foundUser

    if (credentials.rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    initializeAuth,
    login,
    logout
  }
})

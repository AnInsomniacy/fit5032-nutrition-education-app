import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

export type UserRole = 'individual' | 'professional' | 'educator'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  profileComplete: boolean
  lastLogin: Date
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const STORAGE_KEYS = {
  USER: 'nutrition_app_user',
  TOKEN: 'nutrition_app_token',
  REFRESH_TOKEN: 'nutrition_app_refresh_token'
} as const

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const isIndividual = computed(() => user.value?.role === 'individual')
  const isProfessional = computed(() => user.value?.role === 'professional')
  const isEducator = computed(() => user.value?.role === 'educator')

  const hasPermission = computed(() => (requiredRole: UserRole) => {
    if (!user.value) return false

    const roleHierarchy = {
      individual: 1,
      professional: 2,
      educator: 3
    }

    return roleHierarchy[user.value.role] >= roleHierarchy[requiredRole]
  })

  const initializeAuth = () => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        refreshToken.value = storedRefreshToken
      } catch (error) {
        console.error('Failed to parse stored auth data:', error)
        clearAuth()
      }
    }
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'sarah@example.com',
          name: 'Sarah Chen',
          role: 'individual',
          profileComplete: true,
          lastLogin: new Date()
        },
        {
          id: '2',
          email: 'robert@example.com',
          name: 'Robert Thompson',
          role: 'individual',
          profileComplete: true,
          lastLogin: new Date()
        },
        {
          id: '3',
          email: 'maria@example.com',
          name: 'Maria Rodriguez',
          role: 'educator',
          profileComplete: true,
          lastLogin: new Date()
        },
        {
          id: '4',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'professional',
          profileComplete: true,
          lastLogin: new Date()
        },
        {
          id: '5',
          email: 'admin',
          name: 'Administrator',
          role: 'professional',
          profileComplete: true,
          lastLogin: new Date()
        },
        {
          id: '6',
          email: 'user',
          name: 'Regular User',
          role: 'individual',
          profileComplete: false,
          lastLogin: new Date()
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 1000))

      const foundUser = mockUsers.find(u => u.email === credentials.email)

      const isValidCredentials = foundUser && (
        (foundUser.email === 'admin' && credentials.password === 'admin') ||
        (foundUser.email === 'user' && credentials.password === 'user') ||
        (foundUser.email !== 'admin' && foundUser.email !== 'user' && credentials.password === 'password123')
      )

      if (!isValidCredentials) {
        throw new Error('Invalid credentials')
      }

      const mockToken = `token_${Date.now()}`
      const mockRefreshToken = `refresh_${Date.now()}`

      user.value = {...foundUser, lastLogin: new Date()}
      token.value = mockToken
      refreshToken.value = mockRefreshToken

      if (credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
        localStorage.setItem(STORAGE_KEYS.TOKEN, token.value)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken.value)
      } else {
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
        sessionStorage.setItem(STORAGE_KEYS.TOKEN, token.value)
      }

    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    clearAuth()
  }

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    sessionStorage.removeItem(STORAGE_KEYS.USER)
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user.value) {
      user.value = {...user.value, ...updates}

      const storage = localStorage.getItem(STORAGE_KEYS.USER) ? localStorage : sessionStorage
      storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
    }
  }

  const refreshAuthToken = async (): Promise<boolean> => {
    if (!refreshToken.value) return false

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const newToken = `token_${Date.now()}`
      token.value = newToken

      const storage = localStorage.getItem(STORAGE_KEYS.TOKEN) ? localStorage : sessionStorage
      storage.setItem(STORAGE_KEYS.TOKEN, newToken)

      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isIndividual,
    isProfessional,
    isEducator,
    hasPermission,
    initializeAuth,
    login,
    logout,
    updateProfile,
    refreshAuthToken
  }
})

function readonly<T>(ref: any): any {
  return ref
}

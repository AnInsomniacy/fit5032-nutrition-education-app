<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div class="mb-3">
      <label for="email" class="form-label">Email Address</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': errors.email }"
        placeholder="Enter your email"
        @blur="validateEmail"
      />
      <div v-if="errors.email" class="invalid-feedback">
        {{ errors.email }}
      </div>
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.password }"
        placeholder="Enter your password (min 4 chars)"
        @blur="validatePassword"
      />
      <div v-if="errors.password" class="invalid-feedback">
        {{ errors.password }}
      </div>
    </div>

    <div class="mb-3 form-check">
      <input
        id="remember"
        v-model="form.rememberMe"
        type="checkbox"
        class="form-check-input"
      />
      <label for="remember" class="form-check-label">
        Remember me
      </label>
    </div>

    <div v-if="loginError" class="alert alert-danger" role="alert">
      {{ loginError }}
    </div>

    <button
      type="submit"
      class="btn btn-primary w-100"
      :disabled="isLoading || !isFormValid"
    >
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
      {{ isLoading ? 'Signing In...' : 'Sign In' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import {reactive, ref, computed} from 'vue'
import {useAuthStore} from '@/stores/auth'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface ValidationErrors {
  email?: string
  password?: string
}

const emit = defineEmits<{
  'login-success': []
}>()

const authStore = useAuthStore()

const form = reactive<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive<ValidationErrors>({})
const isLoading = ref(false)
const loginError = ref('')

const isFormValid = computed(() => {
  return form.email &&
    form.password &&
    !errors.email &&
    !errors.password &&
    form.email.length > 0 &&
    form.password.length >= 4
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  } else {
    delete errors.email
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 4) {
    errors.password = 'Password must be at least 4 characters'
  } else {
    delete errors.password
  }
}

const handleSubmit = async () => {
  validateEmail()
  validatePassword()

  if (!isFormValid.value) return

  isLoading.value = true
  loginError.value = ''

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe
    })
    emit('login-success')
  } catch (error) {
    loginError.value = 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-primary:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>

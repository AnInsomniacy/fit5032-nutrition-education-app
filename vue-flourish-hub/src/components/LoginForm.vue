<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.username }"
        placeholder="Enter username"
        required
      />
      <div v-if="errors.username" class="invalid-feedback">
        {{ errors.username }}
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
        placeholder="Enter password"
        required
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

    <div v-if="loginError" class="alert alert-danger">
      {{ loginError }}
    </div>

    <button
      type="submit"
      class="btn btn-primary w-100"
      :disabled="isLoading || !isValid"
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
  username: string
  password: string
  rememberMe: boolean
}

const emit = defineEmits<{
  'login-success': []
}>()

const authStore = useAuthStore()

const form = reactive<LoginForm>({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)
const loginError = ref('')

const isValid = computed(() => {
  return form.username.length >= 2 && form.password.length >= 4
})

const validate = () => {
  errors.username = form.username.length < 2 ? 'Username must be at least 2 characters' : ''
  errors.password = form.password.length < 4 ? 'Password must be at least 4 characters' : ''
  return !errors.username && !errors.password
}

const handleSubmit = async () => {
  if (!validate()) return

  isLoading.value = true
  loginError.value = ''

  try {
    await authStore.login({
      username: form.username,
      password: form.password,
      rememberMe: form.rememberMe
    })
    emit('login-success')
  } catch {
    loginError.value = 'Invalid username or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-primary:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>

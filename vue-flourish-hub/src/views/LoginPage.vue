<template>
  <div class="login-page min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="text-primary">Nutrition Education Platform</h2>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <LoginForm @login-success="handleLoginSuccess"/>

              <div class="text-center mt-3">
                <p class="small text-muted">
                  Don't have an account?
                  <router-link to="/register" class="text-primary">Sign up</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()

const handleLoginSuccess = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
}

.text-primary {
  color: #28a745 !important;
}
</style>

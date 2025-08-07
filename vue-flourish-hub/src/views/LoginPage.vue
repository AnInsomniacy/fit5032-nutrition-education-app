<template>
  <div class="login-page min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="text-success mb-1">Nutrition Platform</h2>
                <p class="text-muted">Sign in to continue</p>
              </div>

              <LoginForm @login-success="handleLoginSuccess"/>

              <div class="text-center mt-3">
                <small class="text-muted">
                  Test accounts: admin/admin, user/user
                </small>
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
  border-radius: 10px;
}
</style>

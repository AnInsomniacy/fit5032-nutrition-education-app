<template>
  <div class="dashboard">
    <header class="bg-success text-white p-3 mb-4">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-0">Welcome, {{ user?.name }}</h1>
            <small class="opacity-75">{{ getRoleText(user?.role) }}</small>
          </div>
          <div class="col-auto">
            <button @click="logout" class="btn btn-outline-light btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-lg-8">
          <div class="row">
            <div class="col-md-6 mb-4">
              <ProgressCard
                title="Daily Calories"
                :current="nutritionData.calories.current"
                :target="nutritionData.calories.target"
                color="success"
                icon="🔥"
              />
            </div>
            <div class="col-md-6 mb-4">
              <ProgressCard
                title="Water Intake"
                :current="nutritionData.water.current"
                :target="nutritionData.water.target"
                color="info"
                icon="💧"
                unit="L"
              />
            </div>
            <div class="col-md-6 mb-4">
              <ProgressCard
                title="Exercise Minutes"
                :current="nutritionData.exercise.current"
                :target="nutritionData.exercise.target"
                color="warning"
                icon="🏃"
                unit="min"
              />
            </div>
            <div class="col-md-6 mb-4">
              <ProgressCard
                title="Sleep Hours"
                :current="nutritionData.sleep.current"
                :target="nutritionData.sleep.target"
                color="primary"
                icon="😴"
                unit="hrs"
              />
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Nutrition Overview</h5>
            </div>
            <div class="card-body">
              <NutritionChart :data="chartData"/>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-success" @click="logFood">
                  Log Food
                </button>
                <button class="btn btn-outline-success" @click="addWater">
                  Add Water
                </button>
                <button class="btn btn-outline-primary" @click="logExercise">
                  Log Exercise
                </button>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
              <div v-for="activity in recentActivities" :key="activity.id"
                   class="d-flex align-items-center mb-3">
                <div class="me-3">{{ activity.icon }}</div>
                <div class="flex-grow-1">
                  <div class="fw-medium">{{ activity.title }}</div>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>

          <div v-if="user?.role === 'educator'" class="card">
            <div class="card-header">
              <h5 class="mb-0">Program Stats</h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-6">
                  <div class="h4 text-primary">{{ programStats.activeUsers }}</div>
                  <small class="text-muted">Active Users</small>
                </div>
                <div class="col-6">
                  <div class="h4 text-success">{{ programStats.completedPrograms }}</div>
                  <small class="text-muted">Completed</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useNutritionStore} from '@/stores/nutrition'
import ProgressCard from '@/components/ProgressCard.vue'
import NutritionChart from '@/components/NutritionChart.vue'

const router = useRouter()
const authStore = useAuthStore()
const nutritionStore = useNutritionStore()

const user = computed(() => authStore.user)
const nutritionData = computed(() => nutritionStore.dailyData)
const chartData = computed(() => nutritionStore.chartData)
const recentActivities = computed(() => nutritionStore.recentActivities)
const programStats = computed(() => nutritionStore.programStats)

const getRoleText = (role?: string) => {
  const roles = {
    individual: 'Personal Health Journey',
    professional: 'Healthcare Professional',
    educator: 'Community Educator'
  }
  return roles[role as keyof typeof roles] || ''
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const logFood = () => {
  nutritionStore.addActivity({
    id: Date.now().toString(),
    title: 'Logged healthy meal',
    icon: '🥗',
    time: 'Just now'
  })
  nutritionStore.updateCalories(300)
}

const addWater = () => {
  nutritionStore.addActivity({
    id: Date.now().toString(),
    title: 'Added water intake',
    icon: '💧',
    time: 'Just now'
  })
  nutritionStore.updateWater(0.25)
}

const logExercise = () => {
  nutritionStore.addActivity({
    id: Date.now().toString(),
    title: 'Logged workout session',
    icon: '🏃',
    time: 'Just now'
  })
  nutritionStore.updateExercise(30)
}

onMounted(() => {
  nutritionStore.loadUserData()
})
</script>

<style scoped>
.dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
}
</style>

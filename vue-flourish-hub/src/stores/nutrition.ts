import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

interface DailyData {
  calories: { current: number; target: number }
  water: { current: number; target: number }
  exercise: { current: number; target: number }
  sleep: { current: number; target: number }
}

interface ChartData {
  macros: {
    carbs: number
    protein: number
    fat: number
    fiber: number
  }
  weekly: number[]
}

interface Activity {
  id: string
  title: string
  icon: string
  time: string
}

interface ProgramStats {
  activeUsers: number
  completedPrograms: number
}

const STORAGE_KEY = 'nutrition_data'

export const useNutritionStore = defineStore('nutrition', () => {
  const dailyData = ref<DailyData>({
    calories: {current: 1650, target: 2000},
    water: {current: 1.8, target: 2.5},
    exercise: {current: 45, target: 60},
    sleep: {current: 7.2, target: 8}
  })

  const chartData = ref<ChartData>({
    macros: {
      carbs: 195,
      protein: 125,
      fat: 65,
      fiber: 28
    },
    weekly: [1800, 2100, 1950, 2200, 1700, 2050, 1650]
  })

  const recentActivities = ref<Activity[]>([
    {
      id: '1',
      title: 'Completed morning workout',
      icon: '🏃',
      time: '2 hours ago'
    },
    {
      id: '2',
      title: 'Logged breakfast',
      icon: '🥞',
      time: '3 hours ago'
    },
    {
      id: '3',
      title: 'Drank water',
      icon: '💧',
      time: '4 hours ago'
    },
    {
      id: '4',
      title: 'Read nutrition article',
      icon: '📖',
      time: '1 day ago'
    }
  ])

  const programStats = ref<ProgramStats>({
    activeUsers: 248,
    completedPrograms: 156
  })

  const totalCaloriesConsumed = computed(() => dailyData.value.calories.current)
  const caloriesRemaining = computed(() =>
    Math.max(0, dailyData.value.calories.target - dailyData.value.calories.current)
  )

  const waterProgress = computed(() =>
    Math.round((dailyData.value.water.current / dailyData.value.water.target) * 100)
  )

  const loadUserData = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        dailyData.value = {...dailyData.value, ...data.dailyData}
        chartData.value = {...chartData.value, ...data.chartData}
      } catch {
        console.warn('Failed to load nutrition data')
      }
    }
  }

  const saveUserData = () => {
    const data = {
      dailyData: dailyData.value,
      chartData: chartData.value,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const updateCalories = (amount: number) => {
    dailyData.value.calories.current += amount
    updateMacros(amount)
    saveUserData()
  }

  const updateWater = (amount: number) => {
    dailyData.value.water.current = Math.round((dailyData.value.water.current + amount) * 10) / 10
    saveUserData()
  }

  const updateExercise = (minutes: number) => {
    dailyData.value.exercise.current += minutes
    saveUserData()
  }

  const updateSleep = (hours: number) => {
    dailyData.value.sleep.current = hours
    saveUserData()
  }

  const updateMacros = (calories: number) => {
    const carbsRatio = 0.45
    const proteinRatio = 0.25
    const fatRatio = 0.30

    const carbCalories = calories * carbsRatio
    const proteinCalories = calories * proteinRatio
    const fatCalories = calories * fatRatio

    chartData.value.macros.carbs += Math.round(carbCalories / 4)
    chartData.value.macros.protein += Math.round(proteinCalories / 4)
    chartData.value.macros.fat += Math.round(fatCalories / 9)
    chartData.value.macros.fiber += Math.round(calories / 100)
  }

  const addActivity = (activity: Activity) => {
    recentActivities.value.unshift(activity)
    if (recentActivities.value.length > 10) {
      recentActivities.value.pop()
    }
  }

  const resetDailyData = () => {
    dailyData.value = {
      calories: {current: 0, target: 2000},
      water: {current: 0, target: 2.5},
      exercise: {current: 0, target: 60},
      sleep: {current: 0, target: 8}
    }

    chartData.value.macros = {
      carbs: 0,
      protein: 0,
      fat: 0,
      fiber: 0
    }

    saveUserData()
  }

  const updateWeeklyData = (dayIndex: number, calories: number) => {
    if (dayIndex >= 0 && dayIndex < 7) {
      chartData.value.weekly[dayIndex] = calories
      saveUserData()
    }
  }

  const getHealthScore = computed(() => {
    const scores = [
      Math.min(dailyData.value.calories.current / dailyData.value.calories.target, 1),
      Math.min(dailyData.value.water.current / dailyData.value.water.target, 1),
      Math.min(dailyData.value.exercise.current / dailyData.value.exercise.target, 1),
      Math.min(dailyData.value.sleep.current / dailyData.value.sleep.target, 1)
    ]

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return Math.round(average * 100)
  })

  return {
    dailyData: computed(() => dailyData.value),
    chartData: computed(() => chartData.value),
    recentActivities: computed(() => recentActivities.value),
    programStats: computed(() => programStats.value),
    totalCaloriesConsumed,
    caloriesRemaining,
    waterProgress,
    getHealthScore,
    loadUserData,
    saveUserData,
    updateCalories,
    updateWater,
    updateExercise,
    updateSleep,
    addActivity,
    resetDailyData,
    updateWeeklyData
  }
})

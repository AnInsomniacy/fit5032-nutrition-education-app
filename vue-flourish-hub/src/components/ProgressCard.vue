<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <div class="me-3 fs-1">{{ icon }}</div>
        <div>
          <h6 class="card-title mb-0">{{ title }}</h6>
          <small class="text-muted">{{ current }}{{ unit }} / {{ target }}{{ unit }}</small>
        </div>
      </div>

      <div class="progress mb-2" style="height: 8px;">
        <div
          class="progress-bar"
          :class="`bg-${color}`"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">{{ progressPercentage }}% complete</small>
        <span v-if="isCompleted" class="badge bg-success">✓ Goal reached</span>
        <span v-else-if="isOverTarget" class="badge bg-warning">Over target</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  title: string
  current: number
  target: number
  color: string
  icon: string
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: ''
})

const progressPercentage = computed(() => {
  const percentage = (props.current / props.target) * 100
  return Math.min(Math.round(percentage), 100)
})

const isCompleted = computed(() => {
  return props.current >= props.target && props.current <= props.target * 1.1
})

const isOverTarget = computed(() => {
  return props.current > props.target * 1.1
})
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>

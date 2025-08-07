<template>
  <div class="nutrition-chart">
    <div class="row">
      <div class="col-md-6">
        <canvas ref="macroChart" width="300" height="300"></canvas>
        <h6 class="text-center mt-2">Macronutrients Distribution</h6>
      </div>
      <div class="col-md-6">
        <canvas ref="weeklyChart" width="300" height="300"></canvas>
        <h6 class="text-center mt-2">Weekly Calories</h6>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-3 text-center">
        <div class="d-flex align-items-center justify-content-center mb-2">
          <div class="legend-color bg-primary"></div>
          <span class="ms-2">Carbs</span>
        </div>
        <div class="h5 text-primary">{{ data.macros.carbs }}g</div>
      </div>
      <div class="col-md-3 text-center">
        <div class="d-flex align-items-center justify-content-center mb-2">
          <div class="legend-color bg-success"></div>
          <span class="ms-2">Protein</span>
        </div>
        <div class="h5 text-success">{{ data.macros.protein }}g</div>
      </div>
      <div class="col-md-3 text-center">
        <div class="d-flex align-items-center justify-content-center mb-2">
          <div class="legend-color bg-warning"></div>
          <span class="ms-2">Fat</span>
        </div>
        <div class="h5 text-warning">{{ data.macros.fat }}g</div>
      </div>
      <div class="col-md-3 text-center">
        <div class="d-flex align-items-center justify-content-center mb-2">
          <div class="legend-color bg-info"></div>
          <span class="ms-2">Fiber</span>
        </div>
        <div class="h5 text-info">{{ data.macros.fiber }}g</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'

interface ChartData {
  macros: {
    carbs: number
    protein: number
    fat: number
    fiber: number
  }
  weekly: number[]
}

interface Props {
  data: ChartData
}

const props = defineProps<Props>()

const macroChart = ref<HTMLCanvasElement>()
const weeklyChart = ref<HTMLCanvasElement>()

const drawPieChart = (canvas: HTMLCanvasElement, data: number[], colors: string[]) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 80

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const total = data.reduce((sum, value) => sum + value, 0)
  let currentAngle = -Math.PI / 2

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = colors[index]
    ctx.fill()

    currentAngle += sliceAngle
  })
}

const drawBarChart = (canvas: HTMLCanvasElement, data: number[]) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const padding = 40
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  const barWidth = chartWidth / data.length
  const maxValue = Math.max(...data)

  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight
    const x = padding + index * barWidth
    const y = canvas.height - padding - barHeight

    ctx.fillStyle = '#28a745'
    ctx.fillRect(x + 5, y, barWidth - 10, barHeight)

    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(value.toString(), x + barWidth / 2, canvas.height - 10)
  })
}

const updateCharts = () => {
  if (macroChart.value) {
    const macroData = [
      props.data.macros.carbs,
      props.data.macros.protein,
      props.data.macros.fat,
      props.data.macros.fiber
    ]
    const macroColors = ['#007bff', '#28a745', '#ffc107', '#17a2b8']
    drawPieChart(macroChart.value, macroData, macroColors)
  }

  if (weeklyChart.value) {
    drawBarChart(weeklyChart.value, props.data.weekly)
  }
}

onMounted(() => {
  updateCharts()
})

watch(() => props.data, updateCharts, {deep: true})
</script>

<style scoped>
.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>

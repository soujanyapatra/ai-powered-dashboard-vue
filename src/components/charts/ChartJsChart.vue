<template>
  <div class="chart-container">
    <Bar
      v-if="chartType === 'bar'"
      :data="chartData"
      :options="chartOptions"
    />
    <Line
      v-else-if="chartType === 'line'"
      :data="chartData"
      :options="chartOptions"
    />
    <Pie
      v-else-if="chartType === 'pie'"
      :data="chartData"
      :options="chartOptions"
    />
    <Doughnut
      v-else-if="chartType === 'donut'"
      :data="chartData"
      :options="chartOptions"
    />
    <Line
      v-else-if="chartType === 'area'"
      :data="chartData"
      :options="areaChartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ChartData } from '@/types/chart'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: ChartData
}

const props = defineProps<Props>()

const chartType = computed(() => props.data.chartType)

const chartData = computed(() => {
  const baseDataset = {
    label: props.data.yAxisLabel || 'Value',
    data: props.data.values,
    borderColor: getBorderColors(),
    borderWidth: 2,
  }

  // For area charts, add fill and backgroundColor
  if (chartType.value === 'area') {
    return {
      labels: props.data.labels,
      datasets: [
        {
          ...baseDataset,
          backgroundColor: getBackgroundColors(),
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }

  return {
    labels: props.data.labels,
    datasets: [
      {
        ...baseDataset,
        backgroundColor: getBackgroundColors(),
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: chartType.value !== 'pie' && chartType.value !== 'donut',
      position: 'top' as const,
    },
    title: {
      display: !!props.data.title,
      text: props.data.title,
      font: {
        size: 16,
        weight: 'bold' as const,
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: chartType.value === 'pie' || chartType.value === 'donut' ? {} : {
    x: {
      title: {
        display: !!props.data.xAxisLabel,
        text: props.data.xAxisLabel,
      },
    },
    y: {
      title: {
        display: !!props.data.yAxisLabel,
        text: props.data.yAxisLabel,
      },
      beginAtZero: true,
    },
  },
}))

// Area chart options (Line chart with fill)
const areaChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    title: {
      display: !!props.data.title,
      text: props.data.title,
      font: {
        size: 16,
        weight: 'bold' as const,
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: !!props.data.xAxisLabel,
        text: props.data.xAxisLabel,
      },
    },
    y: {
      title: {
        display: !!props.data.yAxisLabel,
        text: props.data.yAxisLabel,
      },
      beginAtZero: true,
    },
  },
  elements: {
    line: {
      fill: true,
      tension: 0.4,
    },
  },
}))

function getBackgroundColors(): string | string[] {
  const colors = [
    'rgba(59, 130, 246, 0.5)',
    'rgba(16, 185, 129, 0.5)',
    'rgba(245, 158, 11, 0.5)',
    'rgba(239, 68, 68, 0.5)',
    'rgba(139, 92, 246, 0.5)',
    'rgba(236, 72, 153, 0.5)',
  ]
  
  if (chartType.value === 'pie' || chartType.value === 'donut') {
    return colors.slice(0, props.data.values.length)
  }
  
  return colors[0]
}

function getBorderColors(): string | string[] {
  const colors = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
  ]
  
  if (chartType.value === 'pie' || chartType.value === 'donut') {
    return colors.slice(0, props.data.values.length)
  }
  
  return colors[0]
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>


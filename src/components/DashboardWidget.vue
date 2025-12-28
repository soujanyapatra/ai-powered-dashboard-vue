<script setup lang="ts">
import { ref } from 'vue'
import type { ChartData } from '@/types/chart'
import ChartJsChart from './charts/ChartJsChart.vue'
import ApexChart from './charts/ApexChart.vue'

interface Props {
  data: ChartData
}

defineProps<Props>()

defineEmits<{
  remove: []
}>()

const selectedLibrary = ref<'chartjs' | 'apex'>('chartjs')
</script>

<template>
  <div class="widget-container bg-white rounded-lg shadow-lg p-6 border border-gray-200">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ data.title }}
      </h3>
      <div class="flex gap-2">
        <select
          v-model="selectedLibrary"
          class="text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="chartjs">Chart.js</option>
          <option value="apex">ApexCharts</option>
        </select>
        <button
          class="text-red-500 hover:text-red-700 p-1 transition-colors"
          title="Remove widget"
          @click="$emit('remove')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="chart-wrapper" style="height: 350px;">
      <ChartJsChart
        v-if="selectedLibrary === 'chartjs'"
        :data="data"
      />
      <ApexChart
        v-else
        :data="data"
      />
    </div>
    
    <div class="mt-4 text-xs text-gray-500">
      <span class="inline-block px-2 py-1 bg-gray-100 rounded">
        Type: {{ data.chartType }}
      </span>
      <span class="inline-block px-2 py-1 bg-gray-100 rounded ml-2">
        Library: {{ selectedLibrary === 'chartjs' ? 'Chart.js' : 'ApexCharts' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { ChartData } from '@/types/chart'
import ChartJsChart from './charts/ChartJsChart.vue'
import ApexChart from './charts/ApexChart.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'

interface Props {
  data: ChartData
  isPreview?: boolean
}

defineProps<Props>()

defineEmits<{
  remove: []
}>()

const selectedLibrary = ref<'chartjs' | 'apex'>('chartjs')

const libraryOptions = [
  { label: 'Chart.js', value: 'chartjs' },
  { label: 'ApexCharts', value: 'apex' },
]
</script>

<template>
  <Card class="bg-white border border-gray-200 rounded-xl transition-all duration-200 overflow-hidden flex flex-col shadow-sm h-full hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
    <template #header>
      <div class="flex justify-between items-start py-5 px-6 bg-slate-50 border-b border-gray-200 gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex flex-col gap-3">
            <h4 class="m-0 text-lg font-semibold text-slate-800 tracking-tight leading-tight">
              {{ data.title }}
            </h4>
            <div class="flex items-center gap-3 flex-wrap">
              <Tag
                :value="data.chartType.toUpperCase()"
                severity="info"
                class="text-xs font-semibold py-1.5 px-3 rounded-md"
              />
              <Tag
                :value="selectedLibrary === 'chartjs' ? 'Chart.js' : 'ApexCharts'"
                severity="secondary"
                class="text-xs font-semibold py-1.5 px-3 rounded-md"
              />
              <span v-if="data.xAxisLabel" class="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <i class="pi pi-arrow-right text-xs opacity-60"></i>
                {{ data.xAxisLabel }}
              </span>
              <span v-if="data.yAxisLabel" class="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <i class="pi pi-arrow-up text-xs opacity-60"></i>
                {{ data.yAxisLabel }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <Dropdown
            v-model="selectedLibrary"
            :options="libraryOptions"
            option-label="label"
            option-value="value"
            class="w-[140px]"
            placeholder="Library"
          />
          <Button
            v-if="!isPreview"
            icon="pi pi-times"
            severity="danger"
            text
            rounded
            size="small"
            class="text-slate-500 transition-all duration-200 w-8 h-8 flex items-center justify-center hover:text-red-600 hover:bg-red-50"
            aria-label="Remove widget"
            @click="$emit('remove')"
          />
        </div>
      </div>
    </template>
    
    <template #content>
      <div class="relative h-[400px] p-6 bg-white flex-1 min-h-[400px] flex items-center justify-center">
        <ChartJsChart
          v-if="selectedLibrary === 'chartjs'"
          :data="data"
        />
        <ApexChart
          v-else
          :data="data"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-card-content) {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.p-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.p-card-body) {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>

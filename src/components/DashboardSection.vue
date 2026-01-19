<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardSection } from '@/types/chart'
import DashboardWidget from './DashboardWidget.vue'
import DataTable from './DataTable.vue'

interface Props {
  section: DashboardSection
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [sectionId: string, chartId: string]
}>()

const chartCount = computed(() => props.section.charts.length)

function handleRemove(chartId: string) {
  emit('remove', props.section.id, chartId)
}

</script>

<template>
  <div class="mb-10">
    <!-- Section Header - Simple, Clean -->
    <div class="flex items-center justify-between py-4 pb-5 mb-5 border-b-2 border-gray-200">
      <div class="flex items-center gap-4 flex-1">
        <div
          :class="[
            'w-10 h-10 flex items-center justify-center rounded-lg text-xl flex-shrink-0',
            section.color === 'blue' ? 'text-blue-600 bg-blue-50 border border-blue-200' :
            section.color === 'green' ? 'text-green-600 bg-green-50 border border-green-200' :
            section.color === 'purple' ? 'text-purple-600 bg-purple-50 border border-purple-200' :
            'text-orange-600 bg-orange-50 border border-orange-200'
          ]"
        >
          <i :class="['pi', section.icon]"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-xl font-bold m-0 mb-1.5 text-slate-800 tracking-tight leading-tight">
            {{ section.title }}
          </h2>
          <p class="m-0 text-slate-500 text-sm leading-relaxed font-normal">
            {{ section.description }}
          </p>
        </div>
      </div>
      <div class="flex items-baseline gap-1 flex-shrink-0 pl-4">
        <span class="text-2xl font-bold text-slate-800 leading-none">{{ chartCount }}</span>
        <span class="text-sm font-medium text-slate-500 lowercase">widget{{ chartCount !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <!-- Section Charts -->
    <div v-if="chartCount > 0" class="w-full mt-2">
      <div class="grid grid-cols-1 gap-5 w-full md:grid-cols-2">
        <template v-for="widget in section.charts" :key="widget.id">
          <DashboardWidget
            v-if="widget.widgetType === 'chart' || !widget.widgetType"
            :data="widget"
            @remove="() => handleRemove(widget.id || '')"
          />
          <DataTable
            v-else-if="widget.widgetType === 'table'"
            :data="widget"
            @remove="() => handleRemove(widget.id || '')"
          />
        </template>
      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center py-12 px-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl min-h-[250px] mt-2">
      <div
        :class="[
          'text-5xl mb-3 opacity-30',
          section.color === 'blue' ? 'text-blue-600' :
          section.color === 'green' ? 'text-green-600' :
          section.color === 'purple' ? 'text-purple-600' :
          'text-orange-600'
        ]"
      >
        <i :class="['pi', section.icon]"></i>
      </div>
      <p class="text-slate-500 text-sm m-0 text-center font-medium">
        No charts or tables in this section yet. Generate a chart to add it here!
      </p>
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed - all using Tailwind */
</style>


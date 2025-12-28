<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <PromptInput />
      
      <div v-if="widgetCount > 0" class="mt-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">
            Dashboard Widgets ({{ widgetCount }})
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardWidget
            v-for="(widget, index) in widgets"
            :key="index"
            :data="widget"
            @remove="removeWidget(index)"
          />
        </div>
      </div>
      
      <div v-else class="mt-8 text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p class="text-gray-500 text-lg">
          No widgets yet. Enter a prompt above to generate your first chart!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import PromptInput from './components/PromptInput.vue'
import DashboardWidget from './components/DashboardWidget.vue'

const store = useDashboardStore()

const widgets = computed(() => store.widgets)
const widgetCount = computed(() => store.widgetCount)

function removeWidget(index: number) {
  store.removeWidget(index)
}
</script>


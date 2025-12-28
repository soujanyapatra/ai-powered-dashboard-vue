import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChartData } from '@/types/chart'
import { generateChartFromPrompt } from '@/services/openaiService'

export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref<ChartData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPrompt = ref('')

  const widgetCount = computed(() => widgets.value.length)

  async function addWidgetFromPrompt(prompt: string) {
    if (!prompt.trim()) {
      error.value = 'Please enter a prompt'
      return
    }

    isLoading.value = true
    error.value = null
    currentPrompt.value = prompt

    try {
      const chartData = await generateChartFromPrompt(prompt)
      
      const newWidget: ChartData = {
        ...chartData,
        title: chartData.title || `Chart ${widgets.value.length + 1}`,
      }
      
      widgets.value.push(newWidget)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate chart'
      console.error('Error generating chart:', err)
    } finally {
      isLoading.value = false
    }
  }

  function removeWidget(index: number) {
    widgets.value.splice(index, 1)
  }

  function clearAllWidgets() {
    widgets.value = []
    error.value = null
  }

  return {
    widgets,
    isLoading,
    error,
    currentPrompt,
    widgetCount,
    addWidgetFromPrompt,
    removeWidget,
    clearAllWidgets,
  }
})


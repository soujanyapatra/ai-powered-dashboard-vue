import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChartData, DashboardSection, WidgetData } from '@/types/chart'
import { generateChartFromPrompt } from '@/services/openaiService'
import { generateDefaultCharts } from '@/utils/defaultCharts'

// Default sections configuration
const defaultSections: DashboardSection[] = [
  {
    id: 'sales-overview',
    title: 'Sales Overview',
    description: 'Track sales performance, trends, and key metrics across all products and regions',
    icon: 'pi-chart-line',
    color: 'blue',
    charts: [],
  },
  {
    id: 'revenue-analysis',
    title: 'Revenue Analysis',
    description: 'Analyze revenue streams, quarterly performance, and revenue distribution',
    icon: 'pi-dollar',
    color: 'green',
    charts: [],
  },
  {
    id: 'performance-metrics',
    title: 'Performance Metrics',
    description: 'Monitor profit margins, expenses, units sold, and customer growth',
    icon: 'pi-chart-bar',
    color: 'purple',
    charts: [],
  },
  {
    id: 'geographic-insights',
    title: 'Geographic Insights',
    description: 'Explore regional performance, market distribution, and location-based analytics',
    icon: 'pi-map',
    color: 'orange',
    charts: [],
  },
]

export const useDashboardStore = defineStore('dashboard', () => {
  const sections = ref<DashboardSection[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPrompt = ref('')
  const selectedSectionId = ref<string | null>(null)
  const previewChart = ref<WidgetData | null>(null)

  // Initialize sections with default charts and tables
  function initializeDashboard() {
    const defaultWidgets = generateDefaultCharts()
    
    // Shuffle widgets for random distribution
    const shuffled = [...defaultWidgets].sort(() => Math.random() - 0.5)
    
    // Distribute widgets across sections with varied counts
    // Section 0: 2 widgets, Section 1: 2 widgets, Section 2: 1 widget, Section 3: 1 widget
    const distribution = [2, 2, 1, 1]
    let widgetIndex = 0
    
    sections.value = defaultSections.map((section, sectionIndex) => {
      const count = distribution[sectionIndex] || 1
      const sectionWidgets: WidgetData[] = []
      
      for (let i = 0; i < count && widgetIndex < shuffled.length; i++) {
        const widget = { ...shuffled[widgetIndex], sectionId: section.id }
        sectionWidgets.push(widget)
        widgetIndex++
      }
      
      return {
        ...section,
        charts: sectionWidgets,
      }
    })
  }

  // Initialize on store creation
  if (sections.value.length === 0) {
    initializeDashboard()
  }

  const widgetCount = computed(() => {
    return sections.value.reduce((total, section) => total + section.charts.length, 0)
  })

  async function generatePreviewChart(prompt: string, sectionId?: string) {
    if (!prompt.trim()) {
      error.value = 'Please enter a prompt'
      return
    }

    isLoading.value = true
    error.value = null
    currentPrompt.value = prompt
    previewChart.value = null

    try {
      const chartData = await generateChartFromPrompt(prompt)
      
      const preview: ChartData = {
        ...chartData,
        id: `preview-${Date.now()}`,
        title: chartData.title || `Chart ${widgetCount.value + 1}`,
        sectionId: sectionId || selectedSectionId.value || sections.value[0]?.id || 'sales-overview',
        widgetType: 'chart',
      }
      
      previewChart.value = preview
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate chart'
      // eslint-disable-next-line no-console
      console.error('Error generating chart:', err)
    } finally {
      isLoading.value = false
    }
  }

  function savePreviewChart(sectionId?: string) {
    if (!previewChart.value) return

    // Use provided sectionId, or from preview chart, or default to first section
    const targetSectionId = sectionId || previewChart.value.sectionId || sections.value[0]?.id || 'sales-overview'
    const section = sections.value.find((s) => s.id === targetSectionId)
    
    if (section) {
      // Replace preview ID with permanent ID
      const savedWidget: WidgetData = {
        ...previewChart.value,
        id: `widget-${Date.now()}`,
        sectionId: section.id,
      }
      // Add widget to section (keep all widgets)
      section.charts.push(savedWidget)
    } else {
      // Fallback: add to first section
      const savedWidget: WidgetData = {
        ...previewChart.value,
        id: `widget-${Date.now()}`,
        sectionId: sections.value[0]?.id || 'sales-overview',
      }
      sections.value[0]?.charts.push(savedWidget)
    }

    previewChart.value = null
    currentPrompt.value = ''
  }

  function discardPreviewChart() {
    previewChart.value = null
    currentPrompt.value = ''
    error.value = null
  }

  function removeWidget(sectionId: string, chartId: string) {
    const section = sections.value.find((s) => s.id === sectionId)
    if (section) {
      const index = section.charts.findIndex((c) => c.id === chartId)
      if (index > -1) {
        section.charts.splice(index, 1)
      }
    }
  }

  function clearAllWidgets() {
    sections.value.forEach((section) => {
      section.charts = []
    })
    error.value = null
  }

  function setSelectedSection(sectionId: string | null) {
    selectedSectionId.value = sectionId
  }

  return {
    sections,
    isLoading,
    error,
    currentPrompt,
    widgetCount,
    selectedSectionId,
    previewChart,
    generatePreviewChart,
    savePreviewChart,
    discardPreviewChart,
    removeWidget,
    clearAllWidgets,
    setSelectedSection,
    initializeDashboard,
  }
})


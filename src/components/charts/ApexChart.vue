<template>
  <div class="chart-container">
    <apexchart
      :type="apexChartType"
      :options="chartOptions"
      :series="chartSeries"
      height="100%"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData } from '@/types/chart'

interface Props {
  data: ChartData
}

const props = defineProps<Props>()

const apexChartType = computed(() => {
  const typeMap: Record<string, 'bar' | 'line' | 'pie' | 'area' | 'donut'> = {
    bar: 'bar',
    line: 'line',
    pie: 'pie',
    area: 'area',
    donut: 'donut',
  }
  return typeMap[props.data.chartType] || 'bar'
})

const chartSeries = computed(() => {
  if (props.data.chartType === 'pie' || props.data.chartType === 'donut') {
    return props.data.values
  }
  return [
    {
      name: props.data.yAxisLabel || 'Value',
      data: props.data.values,
    },
  ]
})

const chartOptions = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseOptions: any = {
    chart: {
      type: apexChartType.value,
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories: props.data.chartType === 'pie' || props.data.chartType === 'donut' 
        ? undefined 
        : props.data.labels,
      title: {
        text: props.data.xAxisLabel,
      },
    },
    yaxis: props.data.chartType === 'pie' || props.data.chartType === 'donut' 
      ? undefined 
      : {
          title: {
            text: props.data.yAxisLabel,
          },
        },
    title: {
      text: props.data.title,
      align: 'left' as const,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    dataLabels: {
      enabled: props.data.chartType === 'pie' || props.data.chartType === 'donut',
    },
    colors: [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
    ],
  }

  if (props.data.chartType === 'pie' || props.data.chartType === 'donut') {
    baseOptions.labels = props.data.labels
  }

  return baseOptions
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>


export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut'

export interface ChartData {
  chartType: ChartType
  labels: string[]
  values: number[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface AIChartResponse {
  chartType: ChartType
  labels: string[]
  values: number[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface SampleDataPoint {
  month: string
  sales: number
  revenue?: number
  expenses?: number
  product?: string
}


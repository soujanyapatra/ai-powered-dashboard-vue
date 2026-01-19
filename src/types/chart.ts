export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut'
export type WidgetType = 'chart' | 'table'

export interface ChartData {
  chartType: ChartType
  labels: string[]
  values: number[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  id?: string
  sectionId?: string
  widgetType?: 'chart'
}

export interface TableData {
  id?: string
  sectionId?: string
  widgetType: 'table'
  title?: string
  headers: string[]
  rows: (string | number)[][]
}

export type WidgetData = ChartData | TableData

export interface DashboardSection {
  id: string
  title: string
  description: string
  icon: string
  color: string
  charts: WidgetData[]
}

export interface AIChartResponse {
  chartType: ChartType
  labels: string[]
  values: number[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface AITableResponse {
  widgetType: 'table'
  title?: string
  headers: string[]
  rows: (string | number)[][]
}

export type AIWidgetResponse = AIChartResponse | AITableResponse

export interface SampleDataPoint {
  month?: string
  quarter?: string
  year?: number
  sales: number
  revenue?: number
  expenses?: number
  profit?: number
  units?: number
  customers?: number
  product?: string
  category?: string
  region?: string
}


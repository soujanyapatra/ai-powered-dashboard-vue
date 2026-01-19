import type { ChartData, TableData, WidgetData } from '@/types/chart'
import {
  sampleSalesData,
  quarterlyData,
  regionalData,
  categoryData,
} from '@/data/sampleData'

/**
 * Generate default widgets (charts and tables) for dashboard initialization
 */
export function generateDefaultCharts(): WidgetData[] {
  // Monthly Sales Trend (Line Chart)
  const monthlySales: ChartData = {
    id: 'default-1',
    chartType: 'line',
    labels: sampleSalesData.map((d) => d.month || ''),
    values: sampleSalesData.map((d) => d.sales),
    title: 'Monthly Sales Trend',
    xAxisLabel: 'Month',
    yAxisLabel: 'Sales ($)',
  }

  // Quarterly Revenue (Bar Chart)
  const quarterlyRevenue: ChartData = {
    id: 'default-2',
    chartType: 'bar',
    labels: quarterlyData.map((d) => d.quarter || ''),
    values: quarterlyData.map((d) => d.revenue || 0),
    title: 'Quarterly Revenue',
    xAxisLabel: 'Quarter',
    yAxisLabel: 'Revenue ($)',
  }

  // Regional Sales Distribution (Pie Chart)
  const regionalSales: ChartData = {
    id: 'default-3',
    chartType: 'pie',
    labels: regionalData.map((d) => d.region || ''),
    values: regionalData.map((d) => d.sales),
    title: 'Sales by Region',
    xAxisLabel: 'Region',
    yAxisLabel: 'Sales ($)',
  }

  // Category Profit Comparison (Bar Chart)
  const categoryProfit: ChartData = {
    id: 'default-4',
    chartType: 'bar',
    labels: categoryData.map((d) => d.category || ''),
    values: categoryData.map((d) => d.profit || 0),
    title: 'Profit by Category',
    xAxisLabel: 'Category',
    yAxisLabel: 'Profit ($)',
  }

  // Revenue vs Expenses (Area Chart)
  const revenueExpenses: ChartData = {
    id: 'default-5',
    chartType: 'area',
    labels: sampleSalesData.slice(-6).map((d) => d.month || ''),
    values: sampleSalesData.slice(-6).map((d) => (d.revenue || 0) - (d.expenses || 0)),
    title: 'Net Profit (Last 6 Months)',
    xAxisLabel: 'Month',
    yAxisLabel: 'Net Profit ($)',
  }

  // Top Products Revenue (Donut Chart)
  const topProducts: ChartData = {
    id: 'default-6',
    chartType: 'donut',
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    values: [74800, 34800, 69600, 128700, 75000],
    title: 'Revenue Distribution by Product',
    xAxisLabel: 'Product',
    yAxisLabel: 'Revenue ($)',
    widgetType: 'chart',
  }

  // Units Sold by Month (Line Chart)
  const unitsSold: ChartData = {
    id: 'default-7',
    chartType: 'line',
    labels: sampleSalesData.map((d) => d.month || ''),
    values: sampleSalesData.map((d) => d.units || 0),
    title: 'Units Sold by Month',
    xAxisLabel: 'Month',
    yAxisLabel: 'Units',
    widgetType: 'chart',
  }

  // Customer Growth (Area Chart)
  const customerGrowth: ChartData = {
    id: 'default-8',
    chartType: 'area',
    labels: sampleSalesData.slice(-6).map((d) => d.month || ''),
    values: sampleSalesData.slice(-6).map((d) => d.customers || 0),
    title: 'Customer Growth (Last 6 Months)',
    xAxisLabel: 'Month',
    yAxisLabel: 'Customers',
    widgetType: 'chart',
  }

  // Regional Performance Table
  const regionalTable: TableData = {
    id: 'default-table-1',
    widgetType: 'table',
    title: 'Regional Performance Summary',
    headers: ['Region', 'Sales ($)', 'Revenue ($)', 'Profit ($)', 'Units', 'Customers'],
    rows: regionalData.map((d) => [
      d.region || '',
      d.sales,
      d.revenue || 0,
      d.profit || 0,
      d.units || 0,
      d.customers || 0,
    ]),
  }

  // Top Products Table
  const productsTable: TableData = {
    id: 'default-table-2',
    widgetType: 'table',
    title: 'Product Performance Overview',
    headers: ['Product', 'Category', 'Total Sales ($)', 'Total Revenue ($)', 'Total Profit ($)'],
    rows: [
      ['Product A', 'Electronics', 31200, 74800, 33200],
      ['Product B', 'Clothing', 11600, 34800, 16900],
      ['Product C', 'Home & Garden', 23200, 69600, 36400],
      ['Product D', 'Sports', 42900, 128700, 64350],
      ['Product E', 'Books', 25000, 75000, 37500],
    ],
  }

  // Quarterly Comparison Table
  const quarterlyTable: TableData = {
    id: 'default-table-3',
    widgetType: 'table',
    title: 'Quarterly Performance Comparison',
    headers: ['Quarter', 'Sales ($)', 'Revenue ($)', 'Expenses ($)', 'Profit ($)', 'Units', 'Customers'],
    rows: quarterlyData.map((d) => [
      d.quarter || '',
      d.sales,
      d.revenue || 0,
      d.expenses || 0,
      d.profit || 0,
      d.units || 0,
      d.customers || 0,
    ]),
  }

  // Add widgetType to all charts
  const charts: ChartData[] = [
    { ...monthlySales, widgetType: 'chart' },
    { ...quarterlyRevenue, widgetType: 'chart' },
    { ...regionalSales, widgetType: 'chart' },
    { ...categoryProfit, widgetType: 'chart' },
    { ...revenueExpenses, widgetType: 'chart' },
    { ...topProducts, widgetType: 'chart' },
    { ...unitsSold, widgetType: 'chart' },
    { ...customerGrowth, widgetType: 'chart' },
  ]

  const tables: TableData[] = [
    regionalTable,
    productsTable,
    quarterlyTable,
  ]

  // Return mixed widgets
  return [...charts, ...tables]
}


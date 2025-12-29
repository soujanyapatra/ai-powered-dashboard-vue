import type { AIChartResponse, AITableResponse, SampleDataPoint } from '@/types/chart'
import {
  quarterlyData,
  regionalData,
  categoryData,
  allProductsData,
  getDataByProduct,
} from '@/data/sampleData'
import type { ParsePromptResult } from '@/services/openaiService'

/**
 * Composable for generating charts from prompts using fallback parser
 * This is used when OpenAI API is not available
 */
export function useChartFallback() {
  /**
   * Get data source based on parsed prompt
   */
  function getDataSource(parsed: ParsePromptResult): {
    data: SampleDataPoint[]
    labels: string[]
    xAxisLabel: string
  } {
    if (parsed.dataSource === 'quarterly') {
      return {
        data: quarterlyData,
        labels: quarterlyData.map((item) => item.quarter || ''),
        xAxisLabel: 'Quarter',
      }
    }

    if (parsed.dataSource === 'regional') {
      return {
        data: regionalData,
        labels: regionalData.map((item) => item.region || ''),
        xAxisLabel: 'Region',
      }
    }

    if (parsed.dataSource === 'category') {
      return {
        data: categoryData,
        labels: categoryData.map((item) => item.category || ''),
        xAxisLabel: 'Category',
      }
    }

    // Default to product data
    const productData = parsed.product ? getDataByProduct(parsed.product) : getDataByProduct('Product A')
    
    // Apply month filter if specified
    const filteredData = parsed.filterMonths && productData[0]?.month
      ? productData.slice(-parsed.filterMonths)
      : productData

    return {
      data: filteredData,
      labels: filteredData.map((item) => item.month || ''),
      xAxisLabel: 'Month',
    }
  }

  /**
   * Generate chart for all products comparison
   */
  function generateAllProductsChart(parsed: ParsePromptResult): AIChartResponse {
    const productMap = new Map<string, number>()
    
    allProductsData.forEach((item) => {
      if (item.product) {
        const current = productMap.get(item.product) || 0
        const value = (item[parsed.dataField] as number) || 0
        productMap.set(item.product, current + value)
      }
    })

    return {
      chartType: parsed.chartType,
      labels: Array.from(productMap.keys()),
      values: Array.from(productMap.values()),
      title: `${parsed.dataField.charAt(0).toUpperCase() + parsed.dataField.slice(1)} by Product`,
      xAxisLabel: 'Product',
      yAxisLabel: parsed.dataField.charAt(0).toUpperCase() + parsed.dataField.slice(1),
    }
  }

  /**
   * Generate chart title based on parsed prompt
   */
  function generateTitle(parsed: ParsePromptResult): string {
    const metric = parsed.dataField.charAt(0).toUpperCase() + parsed.dataField.slice(1)
    const dataSource = parsed.dataSource
    
    if (dataSource === 'quarterly') {
      return `${metric} by Quarter`
    }
    
    if (dataSource === 'regional') {
      return `${metric} by Region`
    }
    
    if (dataSource === 'category') {
      return `${metric} by Category`
    }
    
    let title = metric
    
    if (parsed.product) {
      title += ` - ${parsed.product}`
    }
    
    // Only add month filter if not using aggregated data sources
    // At this point, dataSource can only be 'all' | 'product' | undefined
    if (parsed.filterMonths) {
      title += ` (Last ${parsed.filterMonths} months)`
    }
    
    return title
  }

  /**
   * Extract values from data based on the requested field
   */
  function extractValues(data: SampleDataPoint[], dataField: ParsePromptResult['dataField']): number[] {
    return data.map((item) => {
      const value = item[dataField]
      return typeof value === 'number' ? value : 0
    })
  }

  /**
   * Main function to generate chart from prompt using fallback parser
   */
  function generateChartFromPrompt(_prompt: string, parsed: ParsePromptResult): AIChartResponse {
    // Handle all products comparison
    if (parsed.dataSource === 'all' || (!parsed.product && !parsed.dataSource)) {
      return generateAllProductsChart(parsed)
    }

    // Get data source
    const { data, labels, xAxisLabel } = getDataSource(parsed)
    
    // Extract values
    const values = extractValues(data, parsed.dataField)
    
    // Generate title
    const title = generateTitle(parsed)

    return {
      chartType: parsed.chartType,
      labels,
      values,
      title,
      xAxisLabel,
      yAxisLabel: parsed.dataField.charAt(0).toUpperCase() + parsed.dataField.slice(1),
    }
  }

  /**
   * Generate table from prompt using fallback parser
   */
  function generateTableFromPrompt(_prompt: string, parsed: ParsePromptResult): AITableResponse {
    // Determine which data source to use
    let data: SampleDataPoint[] = []
    let headers: string[] = []
    let title = 'Data Table'

    if (parsed.dataSource === 'quarterly') {
      data = quarterlyData
      headers = ['Quarter', 'Sales', 'Revenue', 'Expenses', 'Profit', 'Units', 'Customers']
      title = 'Quarterly Performance'
    } else if (parsed.dataSource === 'regional') {
      data = regionalData
      headers = ['Region', 'Sales', 'Revenue', 'Profit', 'Units', 'Customers']
      title = 'Regional Performance'
    } else if (parsed.dataSource === 'category') {
      data = categoryData
      headers = ['Category', 'Sales', 'Revenue', 'Profit', 'Units', 'Customers']
      title = 'Category Performance'
    } else if (parsed.dataSource === 'all' || !parsed.product) {
      // All products table
      const productMap = new Map<string, {
        sales: number
        revenue: number
        profit: number
        units: number
        customers: number
      }>()

      allProductsData.forEach((item) => {
        if (item.product) {
          const current = productMap.get(item.product) || {
            sales: 0,
            revenue: 0,
            profit: 0,
            units: 0,
            customers: 0,
          }
          productMap.set(item.product, {
            sales: current.sales + item.sales,
            revenue: (current.revenue || 0) + (item.revenue || 0),
            profit: (current.profit || 0) + (item.profit || 0),
            units: (current.units || 0) + (item.units || 0),
            customers: (current.customers || 0) + (item.customers || 0),
          })
        }
      })

      headers = ['Product', 'Sales', 'Revenue', 'Profit', 'Units', 'Customers']
      title = 'Product Performance Overview'

      const rows: (string | number)[][] = Array.from(productMap.entries()).map(([product, metrics]) => [
        product,
        metrics.sales,
        metrics.revenue,
        metrics.profit,
        metrics.units,
        metrics.customers,
      ])

      return {
        widgetType: 'table',
        title,
        headers,
        rows,
      }
    } else {
      // Product-specific monthly data
      const productData = getDataByProduct(parsed.product)
      const filteredData = parsed.filterMonths && productData[0]?.month
        ? productData.slice(-parsed.filterMonths)
        : productData

      data = filteredData
      headers = ['Month', 'Sales', 'Revenue', 'Expenses', 'Profit', 'Units', 'Customers']
      title = `${parsed.product} Monthly Performance`
    }

    // Generate rows from data
    const rows: (string | number)[][] = data.map((item) => {
      const row: (string | number)[] = []

      // First column is the identifier (month, quarter, region, category)
      if (item.month) row.push(item.month)
      else if (item.quarter) row.push(item.quarter)
      else if (item.region) row.push(item.region)
      else if (item.category) row.push(item.category)
      else row.push('')

      // Add numeric columns
      row.push(item.sales)
      if (headers.includes('Revenue')) row.push(item.revenue || 0)
      if (headers.includes('Expenses')) row.push(item.expenses || 0)
      if (headers.includes('Profit')) row.push(item.profit || 0)
      if (headers.includes('Units')) row.push(item.units || 0)
      if (headers.includes('Customers')) row.push(item.customers || 0)

      return row
    })

    return {
      widgetType: 'table',
      title,
      headers,
      rows,
    }
  }

  return {
    generateChartFromPrompt,
    generateTableFromPrompt,
  }
}


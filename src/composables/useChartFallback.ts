import type { AIChartResponse, SampleDataPoint } from '@/types/chart'
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

  return {
    generateChartFromPrompt,
  }
}


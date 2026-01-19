import type { ChartType } from '@/types/chart'
import type { ParsePromptResult } from '@/services/openaiService'

/**
 * Utility functions for parsing user prompts to extract chart requirements
 */

/**
 * Extract chart type from prompt
 */
function extractChartType(prompt: string): ChartType {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('line') || lowerPrompt.includes('trend')) {
    return 'line'
  }
  if (lowerPrompt.includes('pie')) {
    return 'pie'
  }
  if (lowerPrompt.includes('area')) {
    return 'area'
  }
  if (lowerPrompt.includes('donut')) {
    return 'donut'
  }
  
  return 'bar'
}

/**
 * Extract data field from prompt
 */
function extractDataField(prompt: string): ParsePromptResult['dataField'] {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('profit')) {
    return 'profit'
  }
  if (lowerPrompt.includes('revenue')) {
    return 'revenue'
  }
  if (lowerPrompt.includes('expense')) {
    return 'expenses'
  }
  if (lowerPrompt.includes('unit')) {
    return 'units'
  }
  if (lowerPrompt.includes('customer')) {
    return 'customers'
  }
  
  return 'sales'
}

/**
 * Extract month filter from prompt
 */
function extractMonthFilter(prompt: string): number | undefined {
  const lowerPrompt = prompt.toLowerCase()
  
  const monthMatch = lowerPrompt.match(/(\d+)\s*month/i)
  if (monthMatch) {
    return parseInt(monthMatch[1], 10)
  }
  
  if (lowerPrompt.includes('last 3 month')) {
    return 3
  }
  if (lowerPrompt.includes('last 6 month')) {
    return 6
  }
  
  return undefined
}

/**
 * Extract product name from prompt
 */
function extractProduct(prompt: string): string | undefined {
  const lowerPrompt = prompt.toLowerCase()
  
  // Try regex match first (e.g., "product a", "product b")
  const productMatch = lowerPrompt.match(/product\s+([a-e])/i)
  if (productMatch) {
    const productLetter = productMatch[1].toUpperCase()
    return `Product ${productLetter}`
  }
  
  // Fallback to explicit checks
  const productMap: Record<string, string> = {
    'product a': 'Product A',
    'product b': 'Product B',
    'product c': 'Product C',
    'product d': 'Product D',
    'product e': 'Product E',
  }
  
  for (const [key, value] of Object.entries(productMap)) {
    if (lowerPrompt.includes(key)) {
      return value
    }
  }
  
  return undefined
}

/**
 * Extract data source type from prompt
 */
function extractDataSource(
  prompt: string,
  product: string | undefined
): ParsePromptResult['dataSource'] {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('quarter') || /q[1-4]/i.test(prompt)) {
    return 'quarterly'
  }
  if (lowerPrompt.includes('region')) {
    return 'regional'
  }
  if (lowerPrompt.includes('categor')) {
    return 'category'
  }
  if (lowerPrompt.includes('all product') || lowerPrompt.includes('compare')) {
    return 'all'
  }
  if (product) {
    return 'product'
  }
  
  return undefined
}

/**
 * Extract region from prompt
 */
function extractRegion(prompt: string): string | undefined {
  const lowerPrompt = prompt.toLowerCase()
  
  const regionMap: Record<string, string> = {
    north: 'North',
    south: 'South',
    east: 'East',
    west: 'West',
    central: 'Central',
  }
  
  for (const [key, value] of Object.entries(regionMap)) {
    if (lowerPrompt.includes(key)) {
      return value
    }
  }
  
  return undefined
}

/**
 * Extract category from prompt
 */
function extractCategory(prompt: string): string | undefined {
  const lowerPrompt = prompt.toLowerCase()
  
  const categoryMap: Record<string, string> = {
    electronic: 'Electronics',
    cloth: 'Clothing',
    'home': 'Home & Garden',
    garden: 'Home & Garden',
    sport: 'Sports',
    book: 'Books',
  }
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerPrompt.includes(key)) {
      return value
    }
  }
  
  return undefined
}

/**
 * Extract widget type (chart or table) from prompt
 */
function extractWidgetType(prompt: string): 'chart' | 'table' {
  const lowerPrompt = prompt.toLowerCase()
  
  // Check for table keywords first (more specific)
  if (
    lowerPrompt.includes('table') ||
    lowerPrompt.includes('tabular') ||
    lowerPrompt.includes('grid') ||
    lowerPrompt.includes('spreadsheet') ||
    (lowerPrompt.includes('show') && lowerPrompt.includes('data') && !lowerPrompt.includes('chart') && !lowerPrompt.includes('graph'))
  ) {
    return 'table'
  }
  
  // Default to chart
  return 'chart'
}

/**
 * Main function to parse user prompt and extract chart requirements
 */
export function parsePrompt(prompt: string): ParsePromptResult {
  const widgetType = extractWidgetType(prompt)
  const chartType = extractChartType(prompt)
  const dataField = extractDataField(prompt)
  const filterMonths = extractMonthFilter(prompt)
  const product = extractProduct(prompt)
  const dataSource = extractDataSource(prompt, product)
  const region = extractRegion(prompt)
  const category = extractCategory(prompt)
  
  return {
    widgetType,
    chartType,
    dataField,
    filterMonths,
    product,
    category,
    region,
    dataSource,
  }
}


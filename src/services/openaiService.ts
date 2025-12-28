import OpenAI from 'openai'
import type { AIChartResponse, ChartType } from '@/types/chart'
import { sampleSalesData, sampleProductData } from '@/data/sampleData'

// Lazy initialization of OpenAI client - only create if API key is available
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI | null {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey || apiKey.trim() === '') {
    return null
  }
  
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Only for frontend demo - in production, use backend proxy
    })
  }
  
  return openaiClient
}

// Export function to check if API key is available
export function hasOpenAIKey(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  return !!(apiKey && apiKey.trim() !== '')
}

export interface ParsePromptResult {
  chartType: ChartType
  dataField: 'sales' | 'revenue' | 'expenses'
  filterMonths?: number
  product?: string
}

/**
 * Parse user prompt to extract chart requirements
 * In a real application, this would use OpenAI to understand the intent
 */
function parsePrompt(prompt: string): ParsePromptResult {
  const lowerPrompt = prompt.toLowerCase()
  
  // Determine chart type
  let chartType: ChartType = 'bar'
  if (lowerPrompt.includes('line') || lowerPrompt.includes('trend')) {
    chartType = 'line'
  } else if (lowerPrompt.includes('pie')) {
    chartType = 'pie'
  } else if (lowerPrompt.includes('area')) {
    chartType = 'area'
  }
  
  // Determine data field
  let dataField: 'sales' | 'revenue' | 'expenses' = 'sales'
  if (lowerPrompt.includes('revenue')) {
    dataField = 'revenue'
  } else if (lowerPrompt.includes('expense')) {
    dataField = 'expenses'
  }
  
  // Extract month filter
  let filterMonths: number | undefined
  const monthMatch = lowerPrompt.match(/(\d+)\s*month/i)
  if (monthMatch) {
    filterMonths = parseInt(monthMatch[1])
  } else if (lowerPrompt.includes('last 3 month')) {
    filterMonths = 3
  } else if (lowerPrompt.includes('last 6 month')) {
    filterMonths = 6
  }
  
  // Extract product
  let product: string | undefined
  if (lowerPrompt.includes('product a')) {
    product = 'Product A'
  } else if (lowerPrompt.includes('product b')) {
    product = 'Product B'
  }
  
  return { chartType, dataField, filterMonths, product }
}

/**
 * Call OpenAI API to generate chart configuration
 * Falls back to simple parsing if API key is not available
 */
export async function generateChartFromPrompt(prompt: string): Promise<AIChartResponse> {
  const openai = getOpenAIClient()
  
  if (!openai) {
    // No API key available, use fallback
    // eslint-disable-next-line no-console
    console.info('OpenAI API key not found. Using fallback parser with sample data.')
    return generateChartFromPromptFallback(prompt)
  }
  
  try {
    const systemPrompt = `You are a data visualization assistant. Given a user's request about data visualization, return a JSON object with the following structure:
{
  "chartType": "bar" | "line" | "pie" | "area" | "donut",
  "labels": ["array", "of", "labels"],
  "values": [array, of, numbers],
  "title": "Chart Title",
  "xAxisLabel": "X Axis Label",
  "yAxisLabel": "Y Axis Label"
}

Available sample data:
- Months: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
- Sales values: 1500-3600 range
- Revenue values: 4800-8500 range
- Expenses values: 2800-4600 range

Return ONLY valid JSON, no markdown, no explanation.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    })
    
    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        chartType: parsed.chartType || 'bar',
        labels: parsed.labels || [],
        values: parsed.values || [],
        title: parsed.title,
        xAxisLabel: parsed.xAxisLabel,
        yAxisLabel: parsed.yAxisLabel,
      }
    }
    
    throw new Error('Invalid JSON in response')
  } catch (error) {
    console.warn('OpenAI API error, using fallback:', error)
    return generateChartFromPromptFallback(prompt)
  }
}

/**
 * Fallback function that uses simple parsing and sample data
 */
function generateChartFromPromptFallback(prompt: string): AIChartResponse {
  const parsed = parsePrompt(prompt)
  const dataSource = parsed.product === 'Product B' ? sampleProductData : sampleSalesData
  
  let data = [...dataSource]
  
  // Apply month filter
  if (parsed.filterMonths) {
    data = data.slice(-parsed.filterMonths)
  }
  
  // Extract labels and values
  const labels = data.map(item => item.month)
  const values = data.map(item => {
    const value = item[parsed.dataField]
    return typeof value === 'number' ? value : 0
  })
  
  // Generate title
  let title = `${parsed.dataField.charAt(0).toUpperCase() + parsed.dataField.slice(1)}`
  if (parsed.product) {
    title += ` - ${parsed.product}`
  }
  if (parsed.filterMonths) {
    title += ` (Last ${parsed.filterMonths} months)`
  }
  
  return {
    chartType: parsed.chartType,
    labels,
    values,
    title,
    xAxisLabel: 'Month',
    yAxisLabel: parsed.dataField.charAt(0).toUpperCase() + parsed.dataField.slice(1),
  }
}


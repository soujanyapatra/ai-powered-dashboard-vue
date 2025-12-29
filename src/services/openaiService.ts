import OpenAI from 'openai'
import type { AIChartResponse, ChartType } from '@/types/chart'
import { CHART_GENERATION_SYSTEM_PROMPT } from '@/prompts/chartPrompts'
import { useChartFallback } from '@/composables/useChartFallback'
import { parsePrompt } from '@/utils/promptParser'

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
  dataField: 'sales' | 'revenue' | 'expenses' | 'profit' | 'units' | 'customers'
  filterMonths?: number
  product?: string
  category?: string
  region?: string
  dataSource?: 'quarterly' | 'regional' | 'category' | 'all' | 'product'
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
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: CHART_GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2, // Lower temperature for more consistent, structured outputs
      max_tokens: 800, // Increased for more detailed responses
      response_format: { type: 'json_object' }, // Force JSON output format
    })
    
    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }
    
    // Parse JSON response (should be valid JSON due to response_format)
    interface ParsedResponse {
      chartType?: string
      labels?: unknown[]
      values?: unknown[]
      title?: string
      xAxisLabel?: string
      yAxisLabel?: string
    }
    
    let parsed: ParsedResponse
    try {
      parsed = JSON.parse(content) as ParsedResponse
    } catch (parseError) {
      // Fallback: try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]) as ParsedResponse
      } else {
        throw new Error('Invalid JSON in response')
      }
    }
    
    // Validate and return structured response
    if (!parsed.labels || !parsed.values || !Array.isArray(parsed.labels) || !Array.isArray(parsed.values)) {
      throw new Error('Invalid chart data structure in response')
    }
    
    // Ensure values are numbers
    const values = parsed.values.map((v: unknown) => {
      const num = typeof v === 'string' ? parseFloat(v) : v
      return typeof num === 'number' && !isNaN(num) ? num : 0
    })
    
    return {
      chartType: (parsed.chartType || 'bar') as ChartType,
      labels: parsed.labels.map((l: unknown) => String(l)),
      values,
      title: parsed.title || 'Chart',
      xAxisLabel: parsed.xAxisLabel || '',
      yAxisLabel: parsed.yAxisLabel || '',
    }
  } catch (error) {
    console.warn('OpenAI API error, using fallback:', error)
    return generateChartFromPromptFallback(prompt)
  }
}

/**
 * Fallback function that uses simple parsing and sample data
 * Delegates to the chart fallback composable for cleaner code
 */
function generateChartFromPromptFallback(prompt: string): AIChartResponse {
  const parsed = parsePrompt(prompt)
  const { generateChartFromPrompt } = useChartFallback()
  return generateChartFromPrompt(prompt, parsed)
}


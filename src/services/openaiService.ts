import OpenAI from "openai";
import type { AIChartResponse, ChartType } from "@/types/chart";
import { CHART_GENERATION_SYSTEM_PROMPT } from "@/prompts/chartPrompts";
import { useChartFallback } from "@/composables/useChartFallback";
import { parsePrompt } from "@/utils/promptParser";

// Lazy initialization of OpenAI client - only create if API key is available
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Only for frontend demo - in production, use backend proxy
    });
  }

  return openaiClient;
}

// Export function to check if API key is available
export function hasOpenAIKey(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!(apiKey && apiKey.trim() !== "");
}

export interface ParsePromptResult {
  chartType: ChartType;
  dataField:
    | "sales"
    | "revenue"
    | "expenses"
    | "profit"
    | "units"
    | "customers";
  filterMonths?: number;
  product?: string;
  category?: string;
  region?: string;
  dataSource?: "quarterly" | "regional" | "category" | "all" | "product";
}

/**
 * Call OpenAI API to generate chart configuration
 * Falls back to simple parsing if API key is not available
 */
export async function generateChartFromPrompt(
  prompt: string
): Promise<AIChartResponse> {
  const openai = getOpenAIClient();

  if (!openai) {
    // No API key available, use fallback
    // eslint-disable-next-line no-console
    console.info(
      "OpenAI API key not found. Using fallback parser with sample data."
    );
    return generateChartFromPromptFallback(prompt);
  }

  try {
    // Use the full system prompt from prompts file
    // Add explicit instruction at the end to prevent it from being returned
    const systemPromptWithInstruction = `${CHART_GENERATION_SYSTEM_PROMPT}

CRITICAL: You must return ONLY the JSON object. Do NOT repeat this prompt, do NOT include explanations, do NOT include markdown formatting. Start your response with { and end with }.`;

    // User message - keep it simple and direct
    const userMessage = `Generate chart configuration for: "${prompt}"

Return ONLY the JSON object matching the structure specified in the system prompt.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use model with reliable JSON support
      messages: [
        { role: "system", content: systemPromptWithInstruction },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: "json_object" }, // Force JSON output format
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Clean the content - remove any system prompt text that might be included
    let cleanedContent = content.trim();

    // Define system prompt indicators for detection
    const systemPromptIndicators = [
      "You are a data visualization assistant",
      "Your task is to analyze",
      "## Available Data Sources",
      "### Products (Monthly Data",
      "### Aggregated Data",
    ];

    // Check if the entire response is just the system prompt (this should not happen, but handle it)
    const isSystemPrompt = systemPromptIndicators.some((indicator: string) =>
      cleanedContent.includes(indicator)
    ) && cleanedContent.length > 200 && !cleanedContent.trim().startsWith("{");

    if (isSystemPrompt) {
      // This looks like the system prompt was returned instead of JSON
      // eslint-disable-next-line no-console
      console.warn(
        "OpenAI returned system prompt instead of JSON, using fallback parser"
      );
      // Immediately use fallback instead of trying to parse
      return generateChartFromPromptFallback(prompt);
    }

    // Remove the system prompt if it's somehow included in the response
    // Check if system prompt text appears before JSON
    const hasSystemPromptBeforeJson = systemPromptIndicators.some((indicator: string) =>
      cleanedContent.includes(indicator)
    ) && cleanedContent.indexOf("{") > 50; // JSON starts after system prompt text

    if (hasSystemPromptBeforeJson) {
      // Find the JSON object in the response (look for the first { that starts a JSON object)
      const jsonStart = cleanedContent.indexOf("{");
      if (jsonStart > -1) {
        // Find the matching closing brace
        let braceCount = 0;
        let jsonEnd = jsonStart;
        for (let i = jsonStart; i < cleanedContent.length; i++) {
          if (cleanedContent[i] === "{") braceCount++;
          if (cleanedContent[i] === "}") {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
        cleanedContent = cleanedContent.substring(jsonStart, jsonEnd);
      } else {
        // No JSON found in response, throw error to use fallback
        throw new Error("No JSON found in response");
      }
    }

    // Remove markdown code blocks if present
    cleanedContent = cleanedContent
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "");

    // Parse JSON response (should be valid JSON due to response_format)
    interface ParsedResponse {
      chartType?: string;
      labels?: unknown[];
      values?: unknown[];
      title?: string;
      xAxisLabel?: string;
      yAxisLabel?: string;
    }

    let parsed: ParsedResponse;
    try {
      // Try parsing the cleaned content directly
      parsed = JSON.parse(cleanedContent) as ParsedResponse;
    } catch (parseError) {
      // Fallback: try to extract JSON using regex
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]) as ParsedResponse;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Failed to parse extracted JSON:", jsonMatch[0]);
          throw new Error("Invalid JSON in response");
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "Failed to find JSON in OpenAI response:",
          cleanedContent.substring(0, 200)
        );
        throw new Error("Invalid JSON in response");
      }
    }

    // Validate and return structured response
    if (
      !parsed.labels ||
      !parsed.values ||
      !Array.isArray(parsed.labels) ||
      !Array.isArray(parsed.values)
    ) {
      throw new Error("Invalid chart data structure in response");
    }

    // Ensure values are numbers
    const values = parsed.values.map((v: unknown) => {
      const num = typeof v === "string" ? parseFloat(v) : v;
      return typeof num === "number" && !isNaN(num) ? num : 0;
    });

    return {
      chartType: (parsed.chartType || "bar") as ChartType,
      labels: parsed.labels.map((l: unknown) => String(l)),
      values,
      title: parsed.title || "Chart",
      xAxisLabel: parsed.xAxisLabel || "",
      yAxisLabel: parsed.yAxisLabel || "",
    };
  } catch (error) {
    console.warn("OpenAI API error, using fallback:", error);
    return generateChartFromPromptFallback(prompt);
  }
}

/**
 * Fallback function that uses simple parsing and sample data
 * Delegates to the chart fallback composable for cleaner code
 */
function generateChartFromPromptFallback(prompt: string): AIChartResponse {
  const parsed = parsePrompt(prompt);
  const { generateChartFromPrompt } = useChartFallback();
  return generateChartFromPrompt(prompt, parsed);
}

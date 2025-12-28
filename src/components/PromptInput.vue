<template>
  <div class="prompt-input-container bg-white rounded-lg shadow-lg p-6 border border-gray-200">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      AI Dashboard Widget Generator
    </h2>
    
    <div v-if="!hasApiKey" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-yellow-800 mb-1">
            OpenAI API Key Not Configured
          </p>
          <p class="text-sm text-yellow-700">
            The app is using a fallback parser with sample data. To enable AI-powered chart generation, add your OpenAI API key to the <code class="px-1 py-0.5 bg-yellow-100 rounded text-xs">.env</code> file as <code class="px-1 py-0.5 bg-yellow-100 rounded text-xs">VITE_OPENAI_API_KEY</code>.
          </p>
        </div>
      </div>
    </div>
    
    <div class="mb-4">
      <label for="prompt" class="block text-sm font-medium text-gray-700 mb-2">
        Enter your prompt:
      </label>
      <textarea
        id="prompt"
        v-model="localPrompt"
        :disabled="isLoading"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="e.g., 'Show monthly sales for Product A' or 'Display revenue vs expenses for last 6 months'"
      ></textarea>
    </div>
    
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>
    
    <div class="flex gap-3">
      <button
        :disabled="isLoading || !localPrompt.trim()"
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        @click="handleSubmit"
      >
        <span v-if="!isLoading">Generate Chart</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Generating...
        </span>
      </button>
      
      <button
        v-if="widgetCount > 0"
        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        @click="handleClear"
      >
        Clear All
      </button>
    </div>
    
    <div class="mt-6">
      <p class="text-sm font-medium text-gray-700 mb-2">Example prompts:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="example in examplePrompts"
          :key="example"
          class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          @click="localPrompt = example"
        >
          {{ example }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { hasOpenAIKey } from '@/services/openaiService'

const store = useDashboardStore()

const hasApiKey = computed(() => hasOpenAIKey())

const localPrompt = ref('')
const examplePrompts = [
  'Show monthly sales for Product A',
  'Display revenue vs expenses for last 6 months',
  'Show sales trend as line chart for last 3 months',
  'Display revenue as pie chart',
  'Show monthly expenses as area chart',
]

watch(() => store.currentPrompt, (newPrompt) => {
  if (newPrompt && newPrompt !== localPrompt.value) {
    localPrompt.value = newPrompt
  }
})

const isLoading = computed(() => store.isLoading)
const error = computed(() => store.error)
const widgetCount = computed(() => store.widgetCount)

function handleSubmit() {
  if (localPrompt.value.trim()) {
    store.addWidgetFromPrompt(localPrompt.value.trim())
    localPrompt.value = ''
  }
}

function handleClear() {
  store.clearAllWidgets()
  localPrompt.value = ''
}
</script>


<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'

const store = useDashboardStore()

const localPrompt = ref('')

const examplePrompts = [
  'Show monthly sales for Product A',
  'Display revenue vs expenses for last 6 months',
  'Show sales trend as line chart for last 3 months',
  'Display revenue as pie chart',
  'Show profit by region',
  'Compare sales across all products',
  'Show quarterly revenue',
  'Display units sold by category',
  'Show customer growth for Product D',
  'Compare expenses by region',
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
    store.generatePreviewChart(localPrompt.value.trim())
    // Don't clear prompt here - let user see it in preview
  }
}

function handleClear() {
  store.clearAllWidgets()
  localPrompt.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <label for="prompt" class="flex items-center gap-2 text-sm font-semibold text-slate-800 m-0">
          <i class="pi pi-pencil text-blue-600 text-base"></i>
          <span>Chart Description</span>
        </label>
        <Textarea
          id="prompt"
          v-model="localPrompt"
          :disabled="isLoading"
          rows="6"
          placeholder="Describe the chart you want to create. For example: 'Show monthly sales trend for Product A' or 'Display revenue comparison across all regions'"
          class="w-full min-h-[150px] p-5 border-2 border-gray-200 rounded-lg text-base leading-relaxed transition-all duration-200 font-inherit focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
          :auto-resize="false"
        />
        <div v-if="localPrompt" class="text-xs text-slate-500 text-right -mt-2">
          {{ localPrompt.length }} characters
        </div>
      </div>
    </div>
    
    <Message
      v-if="error"
      severity="error"
      :closable="false"
      class="m-0"
    >
      <div class="ml-2">{{ error }}</div>
    </Message>
    
    <div class="flex gap-4 items-center">
      <Button
        :label="isLoading ? 'Generating Chart...' : 'Generate Chart'"
        icon="pi pi-chart-bar"
        :loading="isLoading"
        :disabled="isLoading || !localPrompt.trim()"
        class="bg-blue-600 border-none font-semibold py-3 px-8 rounded-lg text-white transition-all duration-200 text-sm hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        @click="handleSubmit"
      />
      
      <Button
        v-if="widgetCount > 0"
        label="Clear All"
        icon="pi pi-trash"
        severity="secondary"
        outlined
        class="text-sm"
        @click="handleClear"
      />
    </div>
    
    <div class="pt-8 border-t border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <i class="pi pi-lightbulb text-orange-500 text-xl"></i>
        <h3 class="text-base font-semibold text-slate-800 m-0">Try These Examples</h3>
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        <button
          v-for="example in examplePrompts"
          :key="example"
          class="py-3 px-4 bg-slate-50 border border-gray-200 rounded-lg text-left text-sm text-slate-800 cursor-pointer transition-all duration-200 font-inherit hover:bg-slate-100 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
          @click="localPrompt = example"
        >
          {{ example }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styles converted to Tailwind classes */
</style>

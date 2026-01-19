<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboardStore'
import { hasOpenAIKey } from '@/services/openaiService'
import PromptInput from '@/components/PromptInput.vue'
import DashboardWidget from '@/components/DashboardWidget.vue'
import DataTable from '@/components/DataTable.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Dropdown from 'primevue/dropdown'

const router = useRouter()
const store = useDashboardStore()

const hasApiKey = computed(() => hasOpenAIKey())
const previewChart = computed(() => store.previewChart)
const sections = computed(() => store.sections)

// Initialize selected section with the preview chart's sectionId or first section
const selectedSectionId = ref<string>(
  previewChart.value?.sectionId || sections.value[0]?.id || 'sales-overview'
)

// Watch for preview chart changes to update selected section
watch(previewChart, (newChart) => {
  if (newChart?.sectionId) {
    selectedSectionId.value = newChart.sectionId
  } else if (sections.value.length > 0) {
    selectedSectionId.value = sections.value[0].id
  }
})

// Create dropdown options from sections
const sectionOptions = computed(() => {
  return sections.value.map((section) => ({
    label: section.title,
    value: section.id,
    icon: section.icon,
    color: section.color,
  }))
})

function handleBackToDashboard() {
  store.discardPreviewChart()
  router.push('/')
}

function handleSave() {
  if (!previewChart.value) return
  
  // Save with selected section
  store.savePreviewChart(selectedSectionId.value)
  router.push('/')
}

function handleDiscard() {
  store.discardPreviewChart()
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto p-0">
    <Card class="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
      <template #header>
        <div class="flex items-center justify-between gap-6 p-8">
          <div class="flex-1 min-w-0">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl font-bold text-slate-800 m-0 tracking-tight leading-tight">
                Create New Chart
              </h2>
              <p class="text-sm text-slate-500 m-0 leading-relaxed font-normal">
                Describe what you want to visualize and we'll generate it for you
              </p>
            </div>
          </div>
          <div class="flex-shrink-0">
            <Button
              icon="pi pi-arrow-left"
              label="Back"
              text
              class="text-slate-500 px-3 py-2 rounded-md transition-all duration-200 text-sm hover:bg-slate-100 hover:text-slate-800"
              @click="handleBackToDashboard"
            />
          </div>
        </div>
      </template>
      
      <template #content>
        <div class="min-h-[400px] p-10">
          <Message
            v-if="!hasApiKey"
            severity="warn"
            :closable="false"
            class="mb-4"
          >
            <div class="ml-2">
              <div class="font-semibold mb-1">OpenAI API Key Not Configured</div>
              <div class="text-sm">
                The app is using a fallback parser with sample data. To enable AI-powered chart generation, add your OpenAI API key to the <code class="px-1 py-0.5 bg-yellow-100 rounded text-xs">.env</code> file as <code class="px-1 py-0.5 bg-yellow-100 rounded text-xs">VITE_OPENAI_API_KEY</code>.
              </div>
            </div>
          </Message>
          
          <div v-if="!previewChart">
            <PromptInput />
          </div>

          <div v-else class="animate-[fadeIn_0.3s_ease-in]">
            <div class="mb-8">
              <Message
                severity="success"
                :closable="false"
                class="mb-4"
              >
                <div class="ml-2">
                  <div class="font-semibold mb-1">Chart Generated Successfully!</div>
                  <div class="text-sm">Review your chart below and save it to add to your dashboard.</div>
                </div>
              </Message>
            </div>

            <div class="mb-10 bg-slate-50 p-6 rounded-xl border border-gray-200">
              <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                <DashboardWidget
                  v-if="previewChart.widgetType === 'chart' || !previewChart.widgetType"
                  :data="previewChart"
                  :is-preview="true"
                  @remove="handleDiscard"
                />
                <DataTable
                  v-else-if="previewChart.widgetType === 'table'"
                  :data="previewChart"
                  :is-preview="true"
                  @remove="handleDiscard"
                />
              </div>
            </div>

            <div class="flex flex-col gap-6 pt-8 border-t border-gray-200">
              <div class="flex flex-col gap-3">
                <label for="section-select" class="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <i class="pi pi-folder text-blue-600 text-base"></i>
                  <span>Save to Section:</span>
                </label>
                <Dropdown
                  id="section-select"
                  v-model="selectedSectionId"
                  :options="sectionOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a section"
                  class="w-full max-w-md"
                >
                  <template #option="slotProps">
                    <div class="flex items-center gap-3 py-2">
                      <i
                        :class="[
                          'pi',
                          slotProps.option.icon,
                          'text-base w-5 text-center',
                          slotProps.option.color === 'blue' ? 'text-blue-600' :
                          slotProps.option.color === 'green' ? 'text-green-600' :
                          slotProps.option.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        ]"
                      ></i>
                      <span>{{ slotProps.option.label }}</span>
                    </div>
                  </template>
                </Dropdown>
              </div>
              
              <div class="flex gap-4 justify-center">
                <Button
                  label="Save to Dashboard"
                  icon="pi pi-check"
                  class="bg-blue-600 border-none font-semibold py-3.5 px-10 shadow-md transition-all duration-200 rounded-lg text-white text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                  @click="handleSave"
                />
                <Button
                  label="Discard"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  @click="handleDiscard"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* PrimeVue card overrides */
:deep(.p-card-header) {
  background: #f8fafc;
  border-bottom: 1px solid #e1e8ed;
  padding: 0;
}

:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-card-content) {
  padding: 2.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


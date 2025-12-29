<script setup lang="ts">
import type { TableData } from '@/types/chart'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

interface Props {
  data: TableData
  isPreview?: boolean
}

defineProps<Props>()

defineEmits<{
  remove: []
}>()
</script>

<template>
  <Card class="bg-white border border-gray-200 rounded-xl transition-all duration-200 overflow-hidden flex flex-col shadow-sm h-full hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
    <template #header>
      <div class="flex justify-between items-center py-5 px-6 bg-slate-50 border-b border-gray-200 gap-4">
        <div class="flex items-center gap-3 flex-1">
          <h4 class="m-0 text-lg font-semibold text-slate-800 tracking-tight leading-tight">
            {{ data.title }}
          </h4>
          <Tag value="TABLE" severity="info" class="text-xs font-semibold py-1.5 px-3 rounded-md" />
        </div>
        <Button
          v-if="!isPreview"
          icon="pi pi-times"
          severity="danger"
          text
          rounded
          size="small"
          class="text-slate-500 transition-all duration-200 w-8 h-8 flex items-center justify-center hover:text-red-600 hover:bg-red-50"
          aria-label="Remove table"
          @click="$emit('remove')"
        />
      </div>
    </template>

    <template #content>
      <div class="p-6 bg-white flex-1 overflow-x-auto">
        <div class="w-full overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  v-for="header in data.headers"
                  :key="header"
                  class="bg-slate-50 py-3 px-4 text-left font-semibold text-slate-800 border-b-2 border-gray-200 whitespace-nowrap text-xs uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIndex) in data.rows"
                :key="rowIndex"
                class="border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50"
              >
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  class="py-3.5 px-4 text-slate-800 border-b border-slate-100"
                >
                  <span v-if="typeof cell === 'number'" class="font-medium tabular-nums">
                    {{ typeof cell === 'number' && cell >= 1000 ? cell.toLocaleString() : cell }}
                  </span>
                  <span v-else>{{ cell }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
:deep(.p-card-body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.p-card-content) {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.p-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>


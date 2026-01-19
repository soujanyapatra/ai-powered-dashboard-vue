<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import DashboardSection from '@/components/DashboardSection.vue'

const store = useDashboardStore()

const sections = computed(() => store.sections)

function handleRemoveWidget(sectionId: string, chartId: string) {
  store.removeWidget(sectionId, chartId)
}
</script>

<template>
  <div class="pb-12">
    <!-- Dashboard Sections -->
    <div class="flex flex-col gap-0 animate-[fadeIn_0.5s_ease-in]">
      <DashboardSection
        v-for="section in sections"
        :key="section.id"
        :section="section"
        @remove="handleRemoveWidget"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


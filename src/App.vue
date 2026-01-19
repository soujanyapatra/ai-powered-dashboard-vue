<template>
  <div class="dashboard-app min-h-screen">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-container">
        <div class="header-content">
          <router-link to="/" class="header-logo">
            <div class="header-icon">
              <i class="pi pi-chart-pie"></i>
            </div>
            <div class="header-text">
              <h1 class="dashboard-title">Dashboard</h1>
            </div>
          </router-link>
          
          <nav class="header-nav">
            <div class="nav-stats">
              <span class="stat-label">Total Charts</span>
              <span class="stat-value">{{ widgetCount }}</span>
            </div>
            <div class="nav-divider"></div>
            <Button
              label="Create Chart"
              icon="pi pi-plus"
              class="nav-button"
              @click="navigateToCreation"
            />
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="container mx-auto px-4 py-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboardStore'
import Button from 'primevue/button'

const router = useRouter()
const store = useDashboardStore()

const widgetCount = computed(() => store.widgetCount)

function navigateToCreation() {
  router.push('/create')
}
</script>

<style scoped>
.dashboard-app {
  background: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e1e8ed;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.header-logo:hover {
  opacity: 0.8;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.nav-divider {
  width: 1px;
  height: 32px;
  background: #e1e8ed;
}

.nav-button {
  background: #2563eb;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #ffffff;
  transition: all 0.2s ease;
  height: 36px;
}

.nav-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.dashboard-main {
  padding: 2rem 0;
  background: #f5f7fa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}
</style>

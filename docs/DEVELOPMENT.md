# Development Documentation

This document provides detailed instructions for developers working with the AI-Powered Dashboard Widget Generator.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [AI API Integration](#ai-api-integration)
3. [Mock Responses & Fallback System](#mock-responses--fallback-system)
4. [Component Reusability](#component-reusability)
5. [Architecture Overview](#architecture-overview)

---

## Installation & Setup

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 20+** - [Download Node.js](https://nodejs.org/)
- **npm, yarn, or pnpm** - Package manager (npm comes with Node.js)
- **Git** (optional) - For version control

### Step-by-Step Installation

#### 1. Navigate to Project Directory

```bash
cd ai-powered-dashboard-vue
```

#### 2. Install Dependencies

Choose one of the following package managers:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm:**
```bash
pnpm install
```

#### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your OpenAI API key (optional - app works without it):

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** The application will work without an API key using the fallback parser with sample data.

#### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

#### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

#### 6. Preview Production Build

```bash
npm run preview
```

### Dependency Overview

#### Core Dependencies

- **vue** (^3.4.0) - Vue.js framework
- **vue-router** (^4.6.4) - Client-side routing
- **pinia** (^2.1.7) - State management
- **typescript** (^5.3.3) - Type safety

#### Chart Libraries

- **chart.js** (^4.4.1) - Chart.js library
- **vue-chartjs** (^5.3.0) - Vue wrapper for Chart.js
- **apexcharts** (^4.0.0) - ApexCharts library
- **vue3-apexcharts** (^1.5.3) - Vue wrapper for ApexCharts

#### UI Libraries

- **primevue** (^3.49.1) - UI component library
- **primeicons** (^6.0.1) - Icon library

#### Styling

- **tailwindcss** (^3.4.0) - Utility-first CSS framework
- **autoprefixer** (^10.4.16) - CSS vendor prefixing
- **postcss** (^8.4.32) - CSS processing

#### AI Integration

- **openai** (^4.20.0) - OpenAI API client
- **axios** (^1.6.2) - HTTP client (if needed for future API calls)

#### Development Dependencies

- **vite** (^5.0.8) - Build tool and dev server
- **@vitejs/plugin-vue** (^5.0.0) - Vite plugin for Vue
- **vue-tsc** (^2.0.0) - TypeScript type checking for Vue
- **eslint** (^8.57.1) - Code linting
- **eslint-plugin-vue** (^9.33.0) - Vue-specific ESLint rules
- **@typescript-eslint/parser** (^6.21.0) - TypeScript parser for ESLint
- **@typescript-eslint/eslint-plugin** (^6.21.0) - TypeScript ESLint rules

### Troubleshooting Installation

#### Node Version Issues

If you encounter errors related to Node.js version:

```bash
# Check your Node.js version
node --version

# Should be 20.x or higher
# If not, update Node.js from nodejs.org
```

#### Dependency Conflicts

If you encounter dependency conflicts:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Port Already in Use

If port 5173 is already in use:

```bash
# Kill process on port 5173 (Linux/Mac)
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

---

## AI API Integration

### Overview

The application integrates with OpenAI's API to generate chart configurations from natural language prompts. It includes a robust fallback system that works without an API key.

### Architecture

```
User Prompt
    ↓
OpenAI API (if key available)
    ↓
JSON Response → Chart Data
    ↓
Fallback Parser (if API fails or no key)
    ↓
Chart Data
```

### Setting Up OpenAI API

#### 1. Get an API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Create a new secret key
5. Copy the key (you won't be able to see it again)

#### 2. Configure Environment Variable

Add the key to your `.env` file:

```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** Never commit your `.env` file to version control. It should be in `.gitignore`.

#### 3. Restart Development Server

After adding the API key, restart the dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### API Configuration

The OpenAI integration is configured in `src/services/openaiService.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",              // Model to use
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
  temperature: 0.1,                 // Lower = more consistent
  max_tokens: 300,                   // Max response length
  response_format: { type: "json_object" }, // Force JSON output
});
```

#### Model Options

You can change the model in `src/services/openaiService.ts`:

- **gpt-4o-mini** (recommended) - Fast, cost-effective, good JSON support
- **gpt-3.5-turbo** - Older, cheaper, may have JSON issues
- **gpt-4-turbo** - More capable, more expensive
- **gpt-4o** - Latest, most capable, most expensive

#### Adjusting Parameters

**Temperature** (0.0 - 2.0):
- Lower (0.1-0.3): More deterministic, consistent outputs
- Higher (0.7-1.0): More creative, varied outputs
- Recommended: 0.1 for structured data generation

**Max Tokens**:
- Lower (200-300): Shorter responses, prevents verbose output
- Higher (500-800): Longer responses, may include unwanted text
- Recommended: 300 for chart configurations

### Customizing the System Prompt

The system prompt is defined in `src/prompts/chartPrompts.ts`:

```typescript
export const CHART_GENERATION_SYSTEM_PROMPT = `...`
```

#### Modifying the Prompt

1. **Add new data sources:**
   - Update the "Available Data Sources" section
   - Add new product, region, or category data

2. **Add new chart types:**
   - Update the "Chart Types" section
   - Add examples for the new chart type

3. **Modify output format:**
   - Update the "Output Format" section
   - Ensure examples match the new format

4. **Add new rules:**
   - Update the "Rules" section
   - Add specific instructions for edge cases

### Error Handling

The service includes comprehensive error handling:

```typescript
try {
  // OpenAI API call
} catch (error) {
  // Automatically falls back to local parser
  return generateChartFromPromptFallback(prompt);
}
```

#### Common Errors

**Invalid API Key:**
- Error: "Incorrect API key provided"
- Solution: Verify your API key in `.env` file

**Rate Limit Exceeded:**
- Error: "Rate limit exceeded"
- Solution: Wait a few minutes or upgrade your OpenAI plan

**Insufficient Credits:**
- Error: "You exceeded your current quota"
- Solution: Add credits to your OpenAI account

**Model Not Available:**
- Error: "Model not found"
- Solution: Check model name or use a different model

All errors automatically trigger the fallback parser, so the application continues working.

### Testing API Integration

#### Test API Key

Create a test script to verify your API key:

```bash
# Create test file
cat > test-api.js << 'EOF'
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "Hello"' }],
      max_tokens: 10,
    });
    console.log('✅ API Key is valid:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ API Key error:', error.message);
  }
}

test();
EOF

# Run test (requires Node.js with ES modules)
node test-api.js
```

#### Verify API Response

Check browser console when generating charts:
- Look for "OpenAI API key not found" - using fallback
- Look for API errors - will automatically fallback
- Look for successful JSON parsing - API working correctly

---

## Mock Responses & Fallback System

### Overview

The application includes a robust fallback system that works without an OpenAI API key. This ensures the application is always functional, even when:
- No API key is configured
- API key is invalid
- API rate limits are exceeded
- Network issues occur
- API returns unexpected format

### Fallback Architecture

```
User Prompt
    ↓
Parse Prompt (extract intent)
    ↓
Match Data Source (products, regions, categories, etc.)
    ↓
Extract Metrics (sales, revenue, profit, etc.)
    ↓
Generate Chart Data
    ↓
Return Chart Configuration
```

### How It Works

#### 1. Prompt Parsing

The fallback system parses natural language prompts in `src/utils/promptParser.ts`:

```typescript
export function parsePrompt(prompt: string): ParsePromptResult {
  // Extracts:
  // - Chart type (bar, line, pie, etc.)
  // - Data field (sales, revenue, etc.)
  // - Product filter (Product A, B, etc.)
  // - Time filter (last 3 months, etc.)
  // - Data source (quarterly, regional, etc.)
}
```

#### 2. Chart Generation

The parsed prompt is used to generate chart data in `src/composables/useChartFallback.ts`:

```typescript
export function useChartFallback() {
  function generateChartFromPrompt(
    prompt: string,
    parsed: ParsePromptResult
  ): AIChartResponse {
    // 1. Determine data source
    // 2. Filter and aggregate data
    // 3. Format labels and values
    // 4. Return chart configuration
  }
}
```

### Available Data Sources

The fallback system uses sample data from `src/data/sampleData.ts`:

#### Product Data (Monthly)
- **Product A**: Electronics, North region
- **Product B**: Clothing, South region
- **Product C**: Home & Garden, East region
- **Product D**: Sports, West region
- **Product E**: Books, Central region

Each product has 12 months of data with:
- Sales
- Revenue
- Expenses
- Profit
- Units sold
- Customers

#### Aggregated Data
- **Quarterly**: Q1, Q2, Q3, Q4 (aggregated metrics)
- **Regional**: North, South, East, West, Central
- **Category**: Electronics, Clothing, Home & Garden, Sports, Books

### Using Mock Responses

#### Enable Fallback Mode

Simply don't provide an API key in `.env`:

```env
# Comment out or remove the API key
# VITE_OPENAI_API_KEY=your_key_here
```

The application will automatically use the fallback parser.

#### Testing Fallback Parser

The fallback parser supports the same prompts as the AI:

```typescript
// These prompts work with fallback parser:
"Show monthly sales for Product A"
"Display revenue vs expenses for last 6 months"
"Show profit by region"
"Compare sales across all products"
"Display quarterly revenue as pie chart"
```

#### Limitations of Fallback

The fallback parser has some limitations compared to AI:

- **Less flexible**: Requires specific keywords (product names, metrics, etc.)
- **Fixed data**: Only uses sample data, can't generate new data
- **Simple parsing**: May not understand complex or ambiguous prompts
- **No learning**: Doesn't improve with usage

### Customizing Fallback Behavior

#### Add New Sample Data

Edit `src/data/sampleData.ts`:

```typescript
export const newProductData: SampleDataPoint[] = [
  { month: 'Jan', sales: 1000, revenue: 3000, ... },
  // ... more data
];
```

#### Extend Prompt Parser

Edit `src/utils/promptParser.ts` to recognize new patterns:

```typescript
// Add new pattern matching
if (prompt.includes('new keyword')) {
  parsed.dataSource = 'new-source';
}
```

#### Customize Chart Generation

Edit `src/composables/useChartFallback.ts`:

```typescript
// Add new chart type handling
if (parsed.chartType === 'new-type') {
  // Custom generation logic
}
```

### Testing Fallback System

#### Test Without API Key

1. Remove or comment out `VITE_OPENAI_API_KEY` in `.env`
2. Restart dev server
3. Try generating charts
4. Verify fallback parser is used (check console)

#### Test Fallback on API Error

1. Use invalid API key
2. Generate a chart
3. Verify automatic fallback
4. Check console for fallback message

#### Test Prompt Parsing

```typescript
import { parsePrompt } from '@/utils/promptParser';

const parsed = parsePrompt("Show monthly sales for Product A");
console.log(parsed);
// Should output: { chartType: 'bar', dataField: 'sales', product: 'Product A', ... }
```

---

## Component Reusability

### Overview

All components in this project are designed to be reusable in other Vue.js applications. This section explains how to extract and use components independently.

### Reusable Components

#### 1. Chart Components

**Location:** `src/components/charts/`

**Files:**
- `ChartJsChart.vue` - Chart.js implementation
- `ApexChart.vue` - ApexCharts implementation

**Usage in Another Project:**

```vue
<script setup lang="ts">
import ChartJsChart from '@/components/charts/ChartJsChart.vue'
import type { ChartData } from '@/types/chart'

const chartData: ChartData = {
  chartType: 'bar',
  labels: ['Jan', 'Feb', 'Mar'],
  values: [100, 200, 300],
  title: 'Monthly Sales',
  xAxisLabel: 'Month',
  yAxisLabel: 'Sales ($)'
}
</script>

<template>
  <div style="height: 400px;">
    <ChartJsChart :data="chartData" />
  </template>
</template>
```

**Dependencies Required:**
```json
{
  "chart.js": "^4.4.1",
  "vue-chartjs": "^5.3.0",
  "apexcharts": "^4.0.0",
  "vue3-apexcharts": "^1.5.3"
}
```

#### 2. Dashboard Widget

**Location:** `src/components/DashboardWidget.vue`

**Usage:**

```vue
<script setup lang="ts">
import DashboardWidget from '@/components/DashboardWidget.vue'
import type { ChartData } from '@/types/chart'

const chartData: ChartData = {
  chartType: 'line',
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  values: [1000, 1500, 1200, 1800],
  title: 'Quarterly Revenue',
  xAxisLabel: 'Quarter',
  yAxisLabel: 'Revenue ($)'
}
</script>

<template>
  <DashboardWidget :data="chartData" />
</template>
```

**Features:**
- Library switching (Chart.js / ApexCharts)
- Chart metadata display
- Remove functionality
- Responsive design

#### 3. Data Table Component

**Location:** `src/components/DataTable.vue`

**Usage:**

```vue
<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import type { TableData } from '@/types/chart'

const tableData: TableData = {
  widgetType: 'table',
  title: 'Sales Summary',
  headers: ['Product', 'Sales', 'Revenue', 'Profit'],
  rows: [
    ['Product A', 31200, 74800, 33200],
    ['Product B', 11600, 34800, 16900],
    ['Product C', 23200, 69600, 36400],
  ]
}
</script>

<template>
  <DataTable :data="tableData" />
</template>
```

#### 4. Dashboard Section

**Location:** `src/components/DashboardSection.vue`

**Usage:**

```vue
<script setup lang="ts">
import DashboardSection from '@/components/DashboardSection.vue'
import type { DashboardSection as SectionType } from '@/types/chart'

const section: SectionType = {
  id: 'sales',
  title: 'Sales Overview',
  description: 'Track sales performance',
  icon: 'pi-chart-line',
  color: 'blue',
  charts: [/* chart data */]
}
</script>

<template>
  <DashboardSection :section="section" />
</template>
```

### Extracting Components to New Project

#### Step 1: Copy Component Files

```bash
# Create components directory in new project
mkdir -p src/components/charts
mkdir -p src/components/widgets

# Copy chart components
cp src/components/charts/ChartJsChart.vue /path/to/new-project/src/components/charts/
cp src/components/charts/ApexChart.vue /path/to/new-project/src/components/charts/

# Copy widget components
cp src/components/DashboardWidget.vue /path/to/new-project/src/components/widgets/
cp src/components/DataTable.vue /path/to/new-project/src/components/widgets/
```

#### Step 2: Copy Type Definitions

```bash
# Copy types
cp src/types/chart.ts /path/to/new-project/src/types/
```

#### Step 3: Install Dependencies

In your new project:

```bash
npm install chart.js vue-chartjs apexcharts vue3-apexcharts
npm install primevue primeicons  # If using DashboardWidget
```

#### Step 4: Configure Build Tools

**For Vite:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**For Vue CLI:**

```javascript
// vue.config.js
const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
}
```

#### Step 5: Import and Use

```vue
<script setup lang="ts">
import ChartJsChart from '@/components/charts/ChartJsChart.vue'
import type { ChartData } from '@/types/chart'

const myChart: ChartData = {
  chartType: 'bar',
  labels: ['A', 'B', 'C'],
  values: [10, 20, 30],
  title: 'My Chart'
}
</script>

<template>
  <ChartJsChart :data="myChart" />
</template>
```

### Component API Reference

#### ChartJsChart / ApexChart

**Props:**
```typescript
interface Props {
  data: ChartData
}

interface ChartData {
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'donut'
  labels: string[]
  values: number[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
}
```

**Events:** None

**Slots:** None

#### DashboardWidget

**Props:**
```typescript
interface Props {
  data: ChartData
  isPreview?: boolean  // Hides remove button if true
}
```

**Events:**
```typescript
{
  remove: []  // Emitted when remove button is clicked
}
```

**Slots:** None

#### DataTable

**Props:**
```typescript
interface Props {
  data: TableData
  isPreview?: boolean
}

interface TableData {
  widgetType: 'table'
  title?: string
  headers: string[]
  rows: (string | number)[][]
}
```

**Events:**
```typescript
{
  remove: []  // Emitted when remove button is clicked
}
```

### Styling Components

#### With Tailwind CSS

The components use Tailwind CSS classes. To use them in a project without Tailwind:

1. **Option 1: Install Tailwind**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Option 2: Extract Styles**
   - Copy relevant Tailwind classes
   - Convert to regular CSS
   - Update component styles

#### With PrimeVue

If using `DashboardWidget`, you need PrimeVue:

```bash
npm install primevue primeicons
```

```typescript
// main.ts
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

app.use(PrimeVue)
```

#### Standalone Styling

For components without PrimeVue dependencies:

```vue
<!-- ChartJsChart.vue - No external UI library needed -->
<!-- ApexChart.vue - No external UI library needed -->
```

These can be used with any styling approach.

### Example: Minimal Integration

Here's a minimal example of using just the chart components:

```vue
<!-- MyChart.vue -->
<script setup lang="ts">
import ChartJsChart from './components/charts/ChartJsChart.vue'

const data = {
  chartType: 'bar' as const,
  labels: ['Jan', 'Feb', 'Mar'],
  values: [100, 200, 150],
  title: 'Sales',
}
</script>

<template>
  <div style="width: 500px; height: 400px;">
    <ChartJsChart :data="data" />
  </div>
</template>
```

**Required dependencies only:**
```json
{
  "chart.js": "^4.4.1",
  "vue-chartjs": "^5.3.0",
  "vue": "^3.4.0"
}
```

### Advanced: Custom Chart Types

To add support for new chart types:

1. **Update Type Definition:**
   ```typescript
   // src/types/chart.ts
   export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'radar'
   ```

2. **Add to ChartJsChart.vue:**
   ```vue
   <Radar
     v-else-if="chartType === 'radar'"
     :data="chartData"
     :options="chartOptions"
   />
   ```

3. **Import in ChartJsChart.vue:**
   ```typescript
   import { Radar } from 'vue-chartjs'
   import { RadarElement, RadialLinearScale } from 'chart.js'
   
   ChartJS.register(RadarElement, RadialLinearScale)
   ```

### Component Customization

#### Custom Colors

Modify chart colors in component:

```typescript
// ChartJsChart.vue
function getBackgroundColors(): string | string[] {
  // Return your custom colors
  return ['#FF5733', '#33FF57', '#3357FF']
}
```

#### Custom Styling

Override component styles:

```vue
<style scoped>
.chart-container {
  /* Your custom styles */
}
</style>
```

#### Custom Options

Pass custom chart options:

```typescript
// Extend chartOptions computed property
const chartOptions = computed(() => ({
  ...baseOptions,
  plugins: {
    ...baseOptions.plugins,
    customPlugin: { /* your options */ }
  }
}))
```

---

## Architecture Overview

### Project Structure

```
src/
├── components/
│   ├── charts/           # Chart rendering components
│   ├── DashboardWidget.vue    # Widget container
│   ├── DashboardSection.vue   # Section container
│   ├── DataTable.vue          # Table component
│   └── PromptInput.vue        # Input component
├── composables/          # Reusable composition functions
│   └── useChartFallback.ts
├── data/                 # Sample datasets
│   └── sampleData.ts
├── prompts/             # AI prompts
│   └── chartPrompts.ts
├── router/              # Vue Router configuration
│   └── index.ts
├── services/            # External service integrations
│   └── openaiService.ts
├── stores/              # Pinia stores
│   └── dashboardStore.ts
├── types/               # TypeScript definitions
│   └── chart.ts
├── utils/               # Utility functions
│   ├── defaultCharts.ts
│   └── promptParser.ts
├── views/               # Page components
│   ├── Dashboard.vue
│   └── ChartCreation.vue
├── App.vue              # Root component
└── main.ts              # Application entry point
```

### Data Flow

```
User Input (Prompt)
    ↓
ChartCreation.vue
    ↓
dashboardStore.generatePreviewChart()
    ↓
openaiService.generateChartFromPrompt()
    ↓
OpenAI API (or Fallback Parser)
    ↓
Chart Data (JSON)
    ↓
Preview in ChartCreation.vue
    ↓
User Saves
    ↓
dashboardStore.savePreviewChart()
    ↓
Added to Dashboard Section
    ↓
Rendered in Dashboard.vue
```

### State Management

**Pinia Store:** `src/stores/dashboardStore.ts`

**State:**
- `sections` - Array of dashboard sections
- `previewChart` - Currently previewed chart
- `isLoading` - Loading state
- `error` - Error messages

**Actions:**
- `generatePreviewChart()` - Generate chart from prompt
- `savePreviewChart()` - Save preview to dashboard
- `discardPreviewChart()` - Discard preview
- `removeWidget()` - Remove widget from section

### Component Hierarchy

```
App.vue
├── Header (Navigation)
└── Router View
    ├── Dashboard.vue
    │   └── DashboardSection (multiple)
    │       └── DashboardWidget / DataTable
    └── ChartCreation.vue
        ├── PromptInput
        └── DashboardWidget / DataTable (preview)
```

---

## Additional Resources

### Documentation Links

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [ApexCharts Documentation](https://apexcharts.com/)
- [PrimeVue Documentation](https://primevue.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

### Code Examples

See the `examples/` directory (if created) for:
- Component usage examples
- Integration examples
- Customization examples

---

**Last Updated:** December 2024


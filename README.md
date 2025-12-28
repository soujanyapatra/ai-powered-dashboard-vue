# AI-Powered Dashboard Widget Generator

A Vue.js 3 application that generates dynamic charts and widgets from natural language prompts using OpenAI's API. The dashboard supports multiple chart libraries (Chart.js and ApexCharts) and provides a modular, reusable component architecture.

## 🚀 Features

- **Natural Language Processing**: Enter prompts like "Show monthly sales for Product A" and get instant charts
- **Multiple Chart Libraries**: Switch between Chart.js and ApexCharts for each widget
- **Chart Types**: Supports bar, line, pie, area, and donut charts
- **Dynamic Rendering**: Charts are generated on-the-fly based on AI responses
- **Modular Components**: Reusable chart components for easy integration
- **State Management**: Uses Pinia for centralized state management
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive UI design

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd ai-powered-dashboard-vue
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📖 Usage

### Basic Usage

1. **Enter a prompt** in the text area. Examples:
   - "Show monthly sales for Product A"
   - "Display revenue vs expenses for last 6 months"
   - "Show sales trend as line chart for last 3 months"
   - "Display revenue as pie chart"

2. **Click "Generate Chart"** to create a widget

3. **Switch chart libraries** using the dropdown in each widget (Chart.js or ApexCharts)

4. **Remove widgets** by clicking the X button on any widget

5. **Clear all widgets** using the "Clear All" button

### Example Prompts

The application understands various natural language prompts:

- **Sales queries**:**
  - "Show monthly sales for Product A"
  - "Display sales for last 6 months"
  - "Show sales trend"

- **Revenue/Expenses:**
  - "Display revenue vs expenses for last 6 months"
  - "Show revenue as pie chart"
  - "Display monthly expenses"

- **Chart type specification:**
  - "Show sales as line chart"
  - "Display revenue as area chart"
  - "Show expenses as bar chart"

- **Time filtering:**
  - "Show sales for last 3 months"
  - "Display revenue for last 6 months"

### How It Works

1. **Prompt Processing**: Your prompt is sent to OpenAI's API (or uses a fallback parser if API key is missing)

2. **AI Response**: The AI returns a structured JSON object:
   ```json
   {
     "chartType": "bar",
     "labels": ["Jan", "Feb", "Mar", "Apr"],
     "values": [2000, 2500, 1800, 2200],
     "title": "Monthly Sales",
     "xAxisLabel": "Month",
     "yAxisLabel": "Sales"
   }
   ```

3. **Chart Rendering**: The dashboard renders the chart using the specified chart library

4. **State Management**: All widgets are stored in Pinia store for easy management

## 🏗️ Project Structure

```
ai-powered-dashboard-vue/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ChartJsChart.vue      # Chart.js implementation
│   │   │   └── ApexChart.vue          # ApexCharts implementation
│   │   ├── DashboardWidget.vue       # Widget container component
│   │   └── PromptInput.vue           # Prompt input component
│   ├── data/
│   │   └── sampleData.ts              # Sample datasets
│   ├── services/
│   │   └── openaiService.ts          # OpenAI API integration
│   ├── stores/
│   │   └── dashboardStore.ts         # Pinia store for state management
│   ├── types/
│   │   └── chart.ts                  # TypeScript type definitions
│   ├── App.vue                       # Main application component
│   ├── main.ts                       # Application entry point
│   └── style.css                     # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### OpenAI API Setup

The application uses OpenAI's API to process prompts. If you don't have an API key, the application will fall back to a simple parser that works with the sample dataset.

**To use OpenAI API:**
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `VITE_OPENAI_API_KEY`

**Note**: For production applications, you should proxy API calls through a backend server to keep your API key secure. The current implementation uses `dangerouslyAllowBrowser: true` for demo purposes only.

### Sample Data

The application includes sample data in `src/data/sampleData.ts`. You can modify this file to add your own datasets:

```typescript
export const sampleSalesData: SampleDataPoint[] = [
  { month: 'Jan', sales: 2000, revenue: 5000, expenses: 3000 },
  // ... more data
]
```

## 🎨 Customization

### Adding New Chart Types

1. **Update the type definition** in `src/types/chart.ts`:
   ```typescript
   export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'your-new-type'
   ```

2. **Add support in chart components** (`ChartJsChart.vue` and `ApexChart.vue`)

3. **Update the AI service** to recognize the new chart type in prompts

### Reusing Components

The chart components are designed to be reusable. You can import them in other Vue applications:

```vue
<script setup lang="ts">
import ChartJsChart from '@/components/charts/ChartJsChart.vue'
import type { ChartData } from '@/types/chart'

const chartData: ChartData = {
  chartType: 'bar',
  labels: ['Jan', 'Feb', 'Mar'],
  values: [100, 200, 300],
  title: 'My Chart'
}
</script>

<template>
  <ChartJsChart :data="chartData" />
</template>
```

## 🧪 Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run build
# This runs vue-tsc for type checking
```

## 📚 Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management for Vue
- **Chart.js** - Simple yet flexible charting library
- **ApexCharts** - Modern charting library
- **OpenAI API** - Natural language processing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling

## 🔒 Security Notes

⚠️ **Important**: The current implementation includes the OpenAI API key in the frontend for demo purposes. In a production environment:

1. **Never expose API keys in frontend code**
2. **Create a backend proxy** to handle OpenAI API calls
3. **Implement rate limiting** and authentication
4. **Validate and sanitize** user inputs on the backend

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new chart types
- Improve the prompt parsing logic
- Add more sample datasets
- Enhance the UI/UX
- Add unit tests

## 📝 License

This project is open source and available for learning purposes.

## 🐛 Troubleshooting

### Charts not rendering

- Check browser console for errors
- Ensure chart libraries are properly installed
- Verify data format matches expected structure

### OpenAI API errors

- Verify your API key is correct in `.env`
- Check your OpenAI account has available credits
- The app will fall back to simple parsing if API fails

### TypeScript errors

- Run `npm run build` to see type errors
- Ensure all imports are correct
- Check that types match in `src/types/chart.ts`

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Check Vue 3, Chart.js, and ApexCharts documentation

---

**Happy coding! 🎉**

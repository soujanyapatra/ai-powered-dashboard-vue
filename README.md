# AI-Powered Dashboard Widget Generator

A modern Vue.js 3 application that generates dynamic charts and data tables from natural language prompts using OpenAI's API. Features a professional dashboard interface with section-based organization, support for multiple chart libraries, and a clean, responsive design built with Tailwind CSS and PrimeVue.

## 🚀 Features

- **Natural Language Processing**: Enter prompts like "Show monthly sales for Product A" and get instant visualizations
- **Multiple Chart Libraries**: Switch between Chart.js and ApexCharts for each widget
- **Chart Types**: Supports bar, line, pie, area, and donut charts
- **Data Tables**: Generate and display tabular data alongside charts
- **Section-Based Dashboard**: Organize widgets into logical sections (Sales Overview, Revenue Analysis, Performance Metrics, Geographic Insights)
- **Dynamic Rendering**: Charts and tables are generated on-the-fly based on AI responses
- **Preview & Save Flow**: Preview generated widgets before saving to your dashboard
- **Section Selection**: Choose which section to save your generated widgets to
- **Default Content**: Dashboard comes pre-populated with sample charts and tables
- **Modular Components**: Reusable components for easy integration
- **State Management**: Uses Pinia for centralized state management
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, utility-first styling
- **PrimeVue UI**: Professional UI components and icons
- **Vue Router**: Multi-page navigation (Dashboard and Chart Creation)

## 📋 Prerequisites

- **Node.js 20+** and npm/yarn/pnpm
- **OpenAI API key** (optional - app works with fallback parser if not provided)
  - Get one at [platform.openai.com](https://platform.openai.com/api-keys)

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

3. **Set up environment variables (optional):**
   
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   
   Add your OpenAI API key (if you have one):
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Note**: The application will work without an API key using a fallback parser with sample data.

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

### Dashboard Overview

The dashboard is organized into **four main sections**:

1. **Sales Overview** - Track sales performance, trends, and key metrics
2. **Revenue Analysis** - Analyze revenue streams and quarterly performance
3. **Performance Metrics** - Monitor profit margins, expenses, and customer growth
4. **Geographic Insights** - Explore regional performance and market distribution

Each section can contain multiple charts and tables, displayed in a responsive grid layout.

### Creating Charts

1. **Navigate to Chart Creation:**
   - Click the "+ Create Chart" button in the header, or
   - Navigate to `/create` route

2. **Enter a prompt** in the text area. Examples:
   - "Show monthly sales for Product A"
   - "Display revenue vs expenses for last 6 months"
   - "Show sales trend as line chart for last 3 months"
   - "Display revenue as pie chart"
   - "Show profit by region"
   - "Compare sales across all products"
   - "Show quarterly revenue"
   - "Display units sold by category"

3. **Click "Generate Chart"** to create a widget

4. **Preview the generated chart or table**

5. **Select a section** from the dropdown to save the widget to

6. **Click "Save to Dashboard"** to add it to your dashboard, or "Discard" to cancel

### Managing Widgets

- **Switch chart libraries**: Use the dropdown in each widget to switch between Chart.js and ApexCharts
- **Remove widgets**: Click the X button on any widget to remove it
- **View widget count**: Check the "Total Charts" count in the header

### Example Prompts

The application understands various natural language prompts:

**Sales queries:**
- "Show monthly sales for Product A"
- "Display sales for last 6 months"
- "Show sales trend"
- "Compare sales across all products"

**Revenue/Expenses:**
- "Display revenue vs expenses for last 6 months"
- "Show revenue as pie chart"
- "Display monthly expenses"
- "Show quarterly revenue"

**Chart type specification:**
- "Show sales as line chart"
- "Display revenue as area chart"
- "Show expenses as bar chart"
- "Display revenue as donut chart"

**Time filtering:**
- "Show sales for last 3 months"
- "Display revenue for last 6 months"
- "Show customer growth for Product D"

**Regional/Category data:**
- "Show profit by region"
- "Display units sold by category"
- "Compare expenses by region"

## 🏗️ Project Structure

```
ai-powered-dashboard-vue/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ChartJsChart.vue      # Chart.js implementation
│   │   │   └── ApexChart.vue          # ApexCharts implementation
│   │   ├── DashboardWidget.vue       # Chart widget container
│   │   ├── DashboardSection.vue      # Section container component
│   │   ├── DataTable.vue              # Table widget component
│   │   └── PromptInput.vue           # Prompt input component
│   ├── data/
│   │   └── sampleData.ts              # Sample datasets
│   ├── router/
│   │   └── index.ts                   # Vue Router configuration
│   ├── services/
│   │   └── openaiService.ts          # OpenAI API integration
│   ├── stores/
│   │   └── dashboardStore.ts         # Pinia store for state management
│   ├── types/
│   │   └── chart.ts                   # TypeScript type definitions
│   ├── utils/
│   │   ├── defaultCharts.ts           # Default charts/tables generator
│   │   └── promptParser.ts           # Fallback prompt parser
│   ├── views/
│   │   ├── Dashboard.vue              # Main dashboard page
│   │   └── ChartCreation.vue          # Chart creation page
│   ├── App.vue                        # Root application component
│   ├── main.ts                        # Application entry point
│   └── style.css                      # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs                      # ESLint configuration
└── README.md
```

## 🔧 Configuration

### OpenAI API Setup

The application uses OpenAI's API to process prompts. If you don't have an API key, the application will automatically fall back to a parser that works with the sample dataset.

**To use OpenAI API:**
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `VITE_OPENAI_API_KEY`
3. Restart the development server

**Note**: For production applications, you should proxy API calls through a backend server to keep your API key secure. The current implementation uses `dangerouslyAllowBrowser: true` for demo purposes only.

### Sample Data

The application includes comprehensive sample data in `src/data/sampleData.ts`:
- Monthly sales data for multiple products (A-E)
- Quarterly aggregated data
- Regional comparison data
- Category-based data
- Multiple metrics: sales, revenue, expenses, profit, units, customers

You can modify this file to add your own datasets.

### Code Quality

The project uses ESLint for code quality:

```bash
# Check for linting errors
npm run lint:check

# Auto-fix linting errors
npm run lint
```

## 🎨 Customization

### Adding New Chart Types

1. **Update the type definition** in `src/types/chart.ts`:
   ```typescript
   export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'your-new-type'
   ```

2. **Add support in chart components** (`ChartJsChart.vue` and `ApexChart.vue`)

3. **Update the AI service** (`openaiService.ts`) to recognize the new chart type in prompts

### Adding New Dashboard Sections

Edit `src/stores/dashboardStore.ts` and add new sections to the `defaultSections` array:

```typescript
const defaultSections: DashboardSection[] = [
  // ... existing sections
  {
    id: 'your-section-id',
    title: 'Your Section Title',
    description: 'Section description',
    icon: 'pi-your-icon',
    color: 'blue', // or 'green', 'purple', 'orange'
    charts: [],
  },
]
```

### Styling

The project uses **Tailwind CSS** for all styling. All components use utility classes instead of custom CSS. You can customize the design by:

- Modifying Tailwind classes in component templates
- Updating `tailwind.config.js` for theme customization
- Adding custom utilities in `src/style.css`

## 🧪 Development

### Development Server

```bash
npm run dev
```

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

### Linting

```bash
# Check for errors
npm run lint:check

# Auto-fix errors
npm run lint
```

## 📚 Technologies Used

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management for Vue
- **Vue Router** - Client-side routing
- **Chart.js** - Simple yet flexible charting library
- **ApexCharts** - Modern, interactive charting library
- **OpenAI API** - Natural language processing for prompt understanding
- **Tailwind CSS** - Utility-first CSS framework
- **PrimeVue** - Rich UI component library
- **PrimeIcons** - Icon library
- **Vite** - Next-generation frontend tooling
- **ESLint** - Code quality and linting

## 🔒 Security Notes

⚠️ **Important**: The current implementation includes the OpenAI API key in the frontend for demo purposes. In a production environment:

1. **Never expose API keys in frontend code**
2. **Create a backend proxy** to handle OpenAI API calls
3. **Implement rate limiting** and authentication
4. **Validate and sanitize** user inputs on the backend
5. **Use environment variables** properly (server-side only)

## 🎯 Key Features Explained

### Section-Based Organization

Widgets are organized into logical sections, making it easy to categorize and find specific visualizations. Each section can contain multiple charts and tables.

### Preview Before Save

When you generate a chart, you can preview it before saving. This allows you to:
- Review the generated visualization
- Select which section to save it to
- Discard if it doesn't meet your needs

### Responsive Grid Layout

- **Mobile**: 1 column layout
- **Tablet**: 2 columns layout
- **Desktop**: 2-3 columns layout (depending on screen size)

### Default Content

The dashboard initializes with sample charts and tables distributed across sections, giving you a starting point to understand the application's capabilities.

## 🐛 Troubleshooting

### Charts not rendering

- Check browser console for errors
- Ensure chart libraries are properly installed (`npm install`)
- Verify data format matches expected structure
- Try switching between Chart.js and ApexCharts

### OpenAI API errors

- Verify your API key is correct in `.env`
- Check your OpenAI account has available credits
- The app will automatically fall back to simple parsing if API fails
- Check browser console for specific error messages

### TypeScript errors

- Run `npm run build` to see type errors
- Ensure all imports are correct
- Check that types match in `src/types/chart.ts`

### Styling issues

- Clear Vite cache: `rm -rf node_modules/.vite`
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Ensure Tailwind CSS is properly configured
- Check that PrimeVue CSS is imported in `src/main.ts`

### Build errors

- Ensure Node.js version is 20+
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for dependency conflicts

## 📝 License

This project is open source and available for learning purposes.

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new chart types
- Improve the prompt parsing logic
- Add more sample datasets
- Enhance the UI/UX
- Add unit tests
- Improve documentation
- Add new dashboard sections

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Check Vue 3, Chart.js, ApexCharts, and PrimeVue documentation
4. Review the project structure to understand the codebase

## 📚 Additional Documentation

For detailed development documentation, see:

- **[Development Guide](./docs/DEVELOPMENT.md)** - Comprehensive guide covering:
  - Detailed installation instructions
  - AI API integration and configuration
  - Mock responses and fallback system
  - Component reusability guide
  - Architecture overview

---

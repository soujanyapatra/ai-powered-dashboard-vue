# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=sk-your-key-here
```

**Note**: If you don't have an OpenAI API key, the app will still work using a fallback parser with sample data.

### Step 3: Run the Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to `http://localhost:5173`

### Step 5: Try It Out!
Enter a prompt like:
- "Show monthly sales for Product A"
- "Display revenue for last 6 months"
- "Show sales as line chart"

## 📝 Example Prompts

Try these prompts to see different chart types:

1. **Bar Chart**: "Show monthly sales for Product A"
2. **Line Chart**: "Display sales trend as line chart"
3. **Pie Chart**: "Show revenue as pie chart"
4. **Time Filter**: "Display expenses for last 3 months"
5. **Area Chart**: "Show revenue as area chart"

## 🎯 Key Features to Try

1. **Switch Chart Libraries**: Use the dropdown in each widget to switch between Chart.js and ApexCharts
2. **Multiple Widgets**: Generate multiple charts and see them all on the dashboard
3. **Remove Widgets**: Click the X button to remove individual widgets
4. **Clear All**: Use the "Clear All" button to reset the dashboard

## 🐛 Troubleshooting

**Charts not showing?**
- Check browser console for errors
- Make sure all dependencies are installed: `npm install`

**OpenAI API errors?**
- Verify your API key in `.env`
- Check you have credits in your OpenAI account
- The app will use fallback parsing if API fails

**TypeScript errors?**
- Run `npm run build` to see detailed errors
- Make sure Node.js version is 18+

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the code structure in `src/`
- Customize sample data in `src/data/sampleData.ts`
- Add your own chart types!

Happy coding! 🎉


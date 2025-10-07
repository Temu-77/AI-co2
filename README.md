# 🌍 AI Ad Banner CO2 Calculator

A modern web application that calculates and visualizes the environmental impact of AI-generated ad banners. Upload an ad banner, and get detailed CO2 emission estimates powered by OpenAI's API, complete with environmental comparisons and recovery metrics.

![AI Image CO2 Calculator](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📢 **Drag & Drop Ad Upload** - Intuitive interface with visual feedback
- 🤖 **AI-Powered Analysis** - Uses OpenAI API to estimate CO2 emissions based on ad banner characteristics
- 📊 **Detailed Metrics** - View generation CO2, transmission CO2, and total environmental impact
- 🌱 **Recovery Metrics** - See how many trees, plastic bottles, bike kilometers, and ocean hours needed to offset emissions
- 🔄 **Dynamic Calculations** - Adjust view counts (1K to 1B impressions) and see real-time recalculations
- 🌈 **Modern UI** - Glassmorphism effects, smooth animations, and emoji-enhanced visuals
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-image-co2-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Open `.env` and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your-api-key-here
   ```
   
   > ⚠️ **Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will open at `http://localhost:5173`

## 🛠️ Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production (outputs to `dist/`)
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm test`** - Run unit tests

## 📖 Usage

1. **Upload an Ad Banner**
   - Drag and drop an AI-generated ad banner onto the upload zone
   - Or click to select a file (supports PNG, JPG, JPEG, WebP, GIF)

2. **View Analysis**
   - Ad banner metadata (resolution, file size, format) is extracted automatically
   - OpenAI API analyzes the ad and estimates CO2 emissions

3. **Explore Impact**
   - See generation CO2 (emissions from creating the ad banner)
   - Adjust view count to see transmission CO2 impact across impressions
   - View environmental comparisons (everyday activities & digital equivalents)
   - Check recovery metrics (trees, recycling, transportation)

4. **Upload Another**
   - Click "Upload New Ad" to analyze a different banner

## 🏗️ Project Structure

```
ai-image-co2-calculator/
├── components/           # React components
│   ├── CO2EmissionCard.tsx
│   ├── EnvironmentalComparisons.tsx
│   ├── ErrorDisplay.tsx
│   ├── ImageMetadataDisplay.tsx
│   ├── ImageUpload.tsx
│   ├── ImpactSummary.tsx
│   ├── LoadingSpinner.tsx
│   ├── RecoveryMetrics.tsx
│   └── ViewCountSelector.tsx
├── utils/               # Utility functions
│   ├── co2Calculations.ts
│   ├── imageProcessing.ts
│   └── openai.ts
├── src/
│   └── main.tsx        # Application entry point
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
├── index.html          # HTML template
├── index.css           # Global styles
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

## 🎨 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: OpenAI GPT-4/GPT-3.5-turbo
- **Testing**: Vitest, Testing Library

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `VITE_OPENAI_MODEL` | OpenAI model to use (default: gpt-4) | No |

## 📦 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - The `dist/` folder contains the production-ready files
   - Deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.)
   - Remember to set environment variables in your hosting platform

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run specific test files
npm run test:run
```

Test coverage includes:
- Image processing utilities
- CO2 calculation formulas
- Component rendering and interactions
- API integration (with mocks)
- Responsive design
- End-to-end user flows

## 🎯 Key Features Explained

### CO2 Calculation

The application calculates two types of emissions:

1. **Generation CO2**: Emissions from creating the AI ad banner
   - Based on ad resolution, file size, and format
   - Considers the AI model (MugenAI Ads 2), system specs, and server location
   - Estimated using OpenAI API analysis

2. **Transmission CO2**: Emissions from serving the ad banner
   - Calculated per impression based on file size
   - Multiplied by selected view count (1K to 1B impressions)

### Environmental Comparisons

Results are contextualized with relatable comparisons:
- **Everyday activities**: Driving, charging phones, boiling water, etc.
- **Digital activities**: Emails, video streaming, web browsing, etc.

### Recovery Metrics

Shows what's needed to offset the emissions:
- 🌳 Trees to plant (1 tree absorbs ~21kg CO2/year)
- ♻️ Plastic bottles to recycle (saves ~0.03kg CO2 each)
- 🚴 Bike kilometers vs driving (saves ~0.12kg CO2/km)
- 🌊 Ocean absorption time (oceans absorb ~2.5kg CO2/m²/year)

## 🎨 Design Philosophy

- **Modern & Engaging**: Glassmorphism effects, gradient borders, smooth animations
- **User-Friendly**: Clear visual feedback, emoji indicators, intuitive interactions
- **Performance-First**: Optimized bundle size, efficient rendering, 60fps animations
- **Accessible**: Keyboard navigation, proper contrast, responsive touch targets
- **Mobile-Optimized**: Single-column layouts, touch-friendly buttons, adaptive spacing

## 🔒 Security Notes

- API keys are stored in environment variables (never in code)
- File uploads are processed client-side only (no server storage)
- Input validation prevents malicious file uploads
- API responses are sanitized before display

## 🐛 Troubleshooting

### API Key Issues
- Ensure your `.env` file exists and contains `VITE_OPENAI_API_KEY`
- Restart the dev server after changing environment variables
- Check that your OpenAI API key is valid and has credits

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Ensure you're using Node.js 16 or higher

### Image Upload Issues
- Check file size (limit: 10MB)
- Verify file format (PNG, JPG, JPEG, WebP, GIF)
- Try a different browser if drag-and-drop isn't working

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for the API that powers emission estimates
- Tailwind CSS for the styling framework
- Lucide for the beautiful icons
- The React and Vite teams for excellent developer tools

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with 💚 for a more sustainable digital future

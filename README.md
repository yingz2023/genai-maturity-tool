# GenAI Maturity Typing Tool

A React-based assessment tool to evaluate your organization's GenAI maturity level and receive actionable feedback.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyingz2023%2Fgenai-maturity-tool)

## ⚙️ Setup Data Storage (Required)

After deploying, you need to set up Vercel KV storage for data collection:

### 1. Create Vercel KV Database
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value)
6. Name it `genai-assessments`
7. Click **Create**

### 2. Connect to Your Project
1. In the KV database page, click **Connect Project**
2. Select your `genai-maturity-tool` project
3. Click **Connect**
4. This automatically adds the required environment variables

### 3. Redeploy
1. Go to **Deployments** tab in your project
2. Click **Redeploy** on the latest deployment
3. ✅ Data submission will now work!

**Note**: Without KV setup, assessments will use fallback storage (resets on deployment).

## Features

- **Sectioned Assessment**: Multi-section questionnaire covering Model Development and Deployment & Monitoring
- **Intelligent Scoring**: Simple average-based scoring system with maturity level classification
- **Actionable Feedback**: Tailored recommendations based on your maturity level
- **Email Collection**: Optional email capture for results delivery
- **Data Analytics**: Admin dashboard with export capabilities
- **Cloud Storage**: Persistent data storage with Vercel KV
- **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion

## Maturity Levels

- **Nascent**: Basic AI awareness and ad-hoc processes
- **Emerging**: Some guidelines and limited automation
- **Established**: Systematic processes and dedicated frameworks
- **Advanced**: Robust automation and comprehensive infrastructure
- **Elite**: Industry-leading practices and continuous innovation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Data Collection

The application collects assessment data and provides an admin dashboard at `/admin` with:

- **Analytics Dashboard**: Summary statistics and visualizations
- **CSV Export**: Download all assessment data
- **Real-time Monitoring**: Track submissions as they happen
- **Cloud Storage**: Persistent storage using Vercel KV

## Deployment

### Vercel (Recommended)

1. **Quick Deploy**: Click the deploy button above
2. **Set up KV Storage**: Follow the setup instructions above
3. **Manual Deploy**:
   ```bash
   npm i -g vercel
   vercel
   ```

4. **GitHub Integration**:
   - Connect your GitHub repo to Vercel
   - Automatic deployments on every push to main branch

### Alternative: GitHub + Vercel Integration

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set up Vercel KV storage
4. Automatic deployments on every push to main branch

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui-compatible components
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Data Storage**: Vercel KV (cloud key-value store)
- **Deployment**: Vercel

## Project Structure

```
├── components/
│   ├── ui/              # Reusable UI components
│   └── TypingTool.tsx   # Main assessment component
├── lib/
│   └── utils.ts         # Utility functions
│   └── database.ts      # Data storage functions (KV + fallback)
├── pages/
│   ├── _app.tsx         # Next.js app component
│   ├── index.tsx        # Main page
│   ├── admin.tsx        # Analytics dashboard
│   └── api/             # API endpoints
├── styles/
│   └── globals.css      # Global styles and Tailwind
└── public/              # Static assets
```

## Troubleshooting

### "Error saving results" Issue
This happens when Vercel KV is not set up. Follow the **Setup Data Storage** instructions above.

### KV Connection Issues
1. Verify KV database is created
2. Ensure it's connected to your project
3. Redeploy after connecting
4. Check environment variables in project settings

## License

MIT 
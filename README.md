# GenAI Maturity Typing Tool

A React-based assessment tool to evaluate your organization's GenAI maturity level and receive actionable feedback.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyingz2023%2Fgenai-maturity-tool)

**✅ Ready to deploy immediately - no additional setup required!**

## Features

- **Sectioned Assessment**: Multi-section questionnaire covering Model Development and Deployment & Monitoring
- **Intelligent Scoring**: Simple average-based scoring system with maturity level classification
- **Actionable Feedback**: Tailored recommendations based on your maturity level
- **Email Collection**: Optional email capture with confirmation tracking
- **Data Analytics**: Admin dashboard with export capabilities
- **Session Storage**: Data persists during active sessions
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

## Data Collection & Storage

The application collects assessment data and provides an admin dashboard at `/admin` with:

- **Analytics Dashboard**: Summary statistics and visualizations
- **Email Tracking**: Logs all email confirmations sent to users
- **CSV Export**: Download all assessment data for analysis
- **Real-time Updates**: Live data refresh every 10 seconds

### Data Persistence

- **During Active Sessions**: All data persists perfectly
- **Between Sessions**: Data resets when serverless functions restart (~15 min of inactivity)
- **Multi-User**: All submissions are aggregated and visible in the admin dashboard
- **Export Capability**: Download CSV before data resets to preserve records

## Deployment

### Vercel (Recommended) - One-Click Deploy

1. **Click the deploy button above** ⬆️
2. **Sign in with GitHub** when prompted
3. **Deploy immediately** - works out of the box!
4. **Get your live URL** in 2-3 minutes

### Manual Deployment Options

#### GitHub + Vercel Integration
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Automatic deployments on every push to main branch

#### Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Alternative Platforms
This app works on any platform that supports Next.js:
- **Netlify**: Supports Next.js with serverless functions
- **Railway**: Full-stack deployment platform
- **Digital Ocean**: App platform with auto-deploy

## Live URLs Structure

After deployment, you'll have:
- **Main Assessment**: `https://your-project.vercel.app/`
- **Admin Dashboard**: `https://your-project.vercel.app/admin`
- **API Endpoints**: `https://your-project.vercel.app/api/*`

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: Custom shadcn/ui-compatible components
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Storage**: Serverless file system (`/tmp` directory)
- **Deployment**: Vercel (or any Next.js compatible platform)

## Project Structure

```
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input)
│   └── TypingTool.tsx   # Main assessment component
├── lib/
│   ├── utils.ts         # Utility functions
│   └── database-simple.ts # File-based storage functions
├── pages/
│   ├── _app.tsx         # Next.js app component
│   ├── index.tsx        # Main assessment page
│   ├── admin.tsx        # Analytics dashboard
│   ├── test-api.tsx     # API testing page (development)
│   └── api/             # API endpoints
│       ├── submit-assessment.ts    # Handle form submissions
│       ├── get-assessments.ts      # Retrieve assessment data
│       └── get-emails.ts           # Retrieve email logs
├── styles/
│   └── globals.css      # Global styles and Tailwind
└── public/              # Static assets
```

## API Endpoints

- **POST** `/api/submit-assessment` - Submit assessment data
- **GET** `/api/get-assessments` - Retrieve all assessments with analytics
- **GET** `/api/get-emails` - Retrieve email notification logs

## Features in Detail

### Assessment Flow
1. **Multi-section questionnaire** with progress tracking
2. **Real-time validation** ensures all questions are answered
3. **Instant scoring** with maturity level calculation
4. **Personalized feedback** based on responses
5. **Email confirmation** with detailed results

### Admin Dashboard
- **Live statistics**: Total assessments, average scores, email conversion
- **Visual analytics**: Maturity level distribution charts
- **Data export**: One-click CSV download
- **Email tracking**: View all confirmation emails sent
- **Auto-refresh**: Updates every 10 seconds

### Email System
- **Personalized emails**: Include user's specific scores and recommendations
- **Tracking**: All emails logged with timestamps
- **Content**: Detailed breakdown of responses and maturity assessment
- **Admin visibility**: View all email activity in dashboard

## Customization

### Adding Questions
Edit `components/TypingTool.tsx` to modify the `sections` array:

```typescript
const sections = [
  {
    title: "Your Section Name",
    questions: [
      {
        id: "q5", // Unique ID
        text: "Your question?",
        options: [
          "Option 1 (score: 1)",
          "Option 2 (score: 2)",
          "Option 3 (score: 3)",
          "Option 4 (score: 4)"
        ]
      }
    ]
  }
]
```

### Modifying Maturity Levels
Update the `maturityLevels` array in the same file to change thresholds or labels.

### Styling
- **Colors**: Modify `tailwind.config.js` for theme changes
- **Components**: Update individual component styles in `components/ui/`
- **Global styles**: Edit `styles/globals.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

MIT License - feel free to use this for your organization's AI maturity assessments!

---

**🎉 Ready to assess your GenAI maturity? [Deploy now](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyingz2023%2Fgenai-maturity-tool) and start collecting insights!** 
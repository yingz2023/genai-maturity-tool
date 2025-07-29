# GenAI Maturity Typing Tool

A React-based assessment tool to evaluate your organization's GenAI maturity level and receive actionable feedback.

## Features

- **Sectioned Assessment**: Multi-section questionnaire covering Model Development and Deployment & Monitoring
- **Intelligent Scoring**: Simple average-based scoring system with maturity level classification
- **Actionable Feedback**: Tailored recommendations based on your maturity level
- **Email Collection**: Optional email capture for results delivery
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

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Choose project settings
   - Deploy!

### Alternative: GitHub + Vercel Integration

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Automatic deployments on every push to main branch

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui-compatible components
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Deployment**: Vercel

## Project Structure

```
├── components/
│   ├── ui/              # Reusable UI components
│   └── TypingTool.tsx   # Main assessment component
├── lib/
│   └── utils.ts         # Utility functions
├── pages/
│   ├── _app.tsx         # Next.js app component
│   └── index.tsx        # Main page
├── styles/
│   └── globals.css      # Global styles and Tailwind
└── public/              # Static assets
```

## License

MIT 
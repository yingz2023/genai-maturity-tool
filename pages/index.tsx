import Head from 'next/head'
import TypingTool from '@/components/TypingTool'

export default function Home() {
  return (
    <>
      <Head>
        <title>GenAI Maturity Typing Tool</title>
        <meta name="description" content="Assess your organization's GenAI maturity level" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              GenAI Maturity Assessment
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your organization's GenAI maturity level and get actionable insights 
              to advance your AI operations.
            </p>
          </div>
          <TypingTool />
        </div>
      </main>
    </>
  )
} 
import { useState } from 'react'
import Head from 'next/head'

export default function TestAPI() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testSubmission = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const testData = {
        responses: { q1: 2, q2: 3, q3: 1, q4: 4 },
        email: 'test@example.com',
        score: 2.5,
        maturityLevel: 'Emerging'
      }

      console.log('Sending test data:', testData)

      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const data = await response.json()
      console.log('Response data:', data)

      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Test error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testRetrieval = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/get-assessments')
      const data = await response.json()
      console.log('Retrieved data:', data)
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Retrieval error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>API Test - GenAI Maturity Tool</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={testSubmission}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
            >
              {loading ? 'Testing...' : 'Test Submit Assessment'}
            </button>
            
            <button
              onClick={testRetrieval}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Get Assessments'}
            </button>
          </div>

          {result && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4">API Response:</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-8 bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open your browser's Developer Tools (F12)</li>
              <li>Go to the Console tab</li>
              <li>Click "Test Submit Assessment" and watch the console</li>
              <li>Check if any errors appear in the console</li>
              <li>Then click "Test Get Assessments" to see if data was saved</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
} 
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AssessmentRecord {
  id: string
  responses: { [key: string]: number }
  email?: string
  score: number
  maturityLevel: string
  timestamp: string
  userAgent?: string
}

interface Summary {
  total: number
  maturityBreakdown: { [key: string]: number }
  averageScore: number
  emailsCollected: number
}

interface EmailRecord {
  id: string
  type: string
  timestamp: string
  to: string
  subject: string
  message: string
}

export default function AdminDashboard() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/get-assessments')
      const data = await response.json()
      
      if (data.success) {
        setAssessments(data.assessments)
        setSummary(data.summary)
      }
      
      // Fetch email log
      try {
        const emailResponse = await fetch('/api/get-emails')
        const emailData = await emailResponse.json()
        if (emailData.success) {
          setEmails(emailData.emails)
        }
      } catch (error) {
        console.warn('Email log not available:', error)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Timestamp', 'Email', 'Score', 'Maturity Level', 'Q1', 'Q2', 'Q3', 'Q4', 'User Agent']
    const rows = assessments.map(assessment => [
      assessment.id,
      new Date(assessment.timestamp).toLocaleString(),
      assessment.email || '',
      assessment.score.toFixed(2),
      assessment.maturityLevel,
      assessment.responses.q1 || '',
      assessment.responses.q2 || '',
      assessment.responses.q3 || '',
      assessment.responses.q4 || '',
      assessment.userAgent || ''
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `genai-maturity-assessments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - GenAI Maturity Tool</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Assessment Analytics Dashboard
              </h1>
              <p className="text-gray-600">GenAI Maturity Tool - Data Overview</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Refresh Data
            </button>
          </div>

          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{summary.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{summary.averageScore.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Emails Collected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{summary.emailsCollected}</div>
                  <div className="text-sm text-gray-500">
                    {summary.total > 0 ? Math.round((summary.emailsCollected / summary.total) * 100) : 0}% conversion
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                  >
                    📊 Export CSV
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Maturity Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {summary && Object.keys(summary.maturityBreakdown).length > 0 ? (
                  Object.entries(summary.maturityBreakdown).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center py-2">
                      <span className="font-medium">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / summary.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No assessments yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📧 Email Notifications ({emails.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {emails.length > 0 ? (
                    emails.slice(0, 10).map((email) => (
                      <div key={email.id} className="border-b pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{email.to}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(email.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs text-green-600">✅ Sent</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No emails sent yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Assessment Data</CardTitle>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Timestamp</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Score</th>
                        <th className="px-4 py-2 text-left">Level</th>
                        <th className="px-4 py-2 text-left">Responses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((assessment) => (
                        <tr key={assessment.id} className="border-b">
                          <td className="px-4 py-2 text-sm">
                            {new Date(assessment.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {assessment.email || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm font-mono">
                            {assessment.score.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {assessment.maturityLevel}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm font-mono">
                            Q1:{assessment.responses.q1} Q2:{assessment.responses.q2} Q3:{assessment.responses.q3} Q4:{assessment.responses.q4}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No assessments submitted yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Complete an assessment on the main page to see data here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 
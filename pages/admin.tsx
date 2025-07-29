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

export default function AdminDashboard() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/get-assessments')
      const data = await response.json()
      
      if (data.success) {
        setAssessments(data.assessments)
        setSummary(data.summary)
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assessment Analytics Dashboard
            </h1>
            <p className="text-gray-600">GenAI Maturity Tool - Data Overview</p>
          </div>

          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.averageScore.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Emails Collected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.emailsCollected}</div>
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
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Export CSV
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
                {summary && Object.entries(summary.maturityBreakdown).map(([level, count]) => (
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
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {assessments.slice(0, 10).map((assessment) => (
                    <div key={assessment.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{assessment.maturityLevel}</div>
                          <div className="text-sm text-gray-600">
                            Score: {assessment.score.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(assessment.timestamp).toLocaleString()}
                          </div>
                        </div>
                        {assessment.email && (
                          <div className="text-xs text-blue-600">📧</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Assessment Data</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <td className="px-4 py-2 text-sm">
                          {assessment.score.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {assessment.maturityLevel}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          Q1:{assessment.responses.q1} Q2:{assessment.responses.q2} Q3:{assessment.responses.q3} Q4:{assessment.responses.q4}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 
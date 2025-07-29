import type { NextApiRequest, NextApiResponse } from 'next'

interface AssessmentData {
  responses: { [key: string]: number }
  email?: string
  score: number
  maturityLevel: string
  timestamp: string
  userAgent?: string
}

interface ApiResponse {
  success: boolean
  message: string
  id?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { responses, email, score, maturityLevel }: AssessmentData = req.body

    // Validate required data
    if (!responses || Object.keys(responses).length === 0) {
      return res.status(400).json({ success: false, message: 'Responses are required' })
    }

    if (!score || !maturityLevel) {
      return res.status(400).json({ success: false, message: 'Score and maturity level are required' })
    }

    // Create submission data
    const submissionData: AssessmentData = {
      responses,
      email: email || undefined,
      score,
      maturityLevel,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']
    }

    // Try to save to database with fallback
    let id: string
    try {
      const { saveAssessment } = await import('@/lib/database')
      id = await saveAssessment(submissionData)
    } catch (kvError) {
      console.warn('KV storage failed, using fallback:', kvError)
      const { saveAssessmentFallback } = await import('@/lib/database')
      id = await saveAssessmentFallback(submissionData)
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Assessment submitted successfully',
      id
    })
    
  } catch (error) {
    console.error('Submission error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save assessment. Please try again.' 
    })
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
} 
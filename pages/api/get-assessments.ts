import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    let assessments
    try {
      const { getAssessments } = await import('@/lib/database')
      assessments = await getAssessments()
    } catch (kvError) {
      console.warn('KV storage failed, using fallback:', kvError)
      const { getAssessmentsFallback } = await import('@/lib/database')
      assessments = await getAssessmentsFallback()
    }
    
    // Calculate summary statistics
    const summary = {
      total: assessments.length,
      maturityBreakdown: assessments.reduce((acc, assessment) => {
        acc[assessment.maturityLevel] = (acc[assessment.maturityLevel] || 0) + 1
        return acc
      }, {} as { [key: string]: number }),
      averageScore: assessments.length > 0 
        ? assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length 
        : 0,
      emailsCollected: assessments.filter(a => a.email).length
    }

    return res.status(200).json({ 
      success: true, 
      assessments, 
      summary 
    })
    
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
} 
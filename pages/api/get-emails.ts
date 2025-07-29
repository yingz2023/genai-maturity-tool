import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { getEmailLog } = await import('@/lib/database-simple')
    const emails = getEmailLog()
    
    return res.status(200).json({ 
      success: true, 
      emails 
    })
    
  } catch (error) {
    console.error('Error fetching emails:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
} 
// Database utility functions using Vercel KV (works in production)
import { kv } from '@vercel/kv'

interface AssessmentRecord {
  id: string
  responses: { [key: string]: number }
  email?: string
  score: number
  maturityLevel: string
  timestamp: string
  userAgent?: string
}

export async function saveAssessment(data: Omit<AssessmentRecord, 'id'>): Promise<string> {
  const id = generateId()
  const record: AssessmentRecord = { id, ...data }
  
  try {
    // Save individual record
    await kv.set(`assessment:${id}`, record)
    
    // Add to list of all assessment IDs
    const existingIds = await kv.get<string[]>('assessment_ids') || []
    existingIds.push(id)
    await kv.set('assessment_ids', existingIds)
    
    return id
  } catch (error) {
    console.error('Error saving assessment:', error)
    throw new Error('Failed to save assessment')
  }
}

export async function getAssessments(): Promise<AssessmentRecord[]> {
  try {
    const assessmentIds = await kv.get<string[]>('assessment_ids') || []
    const assessments: AssessmentRecord[] = []
    
    // Fetch all assessments
    for (const id of assessmentIds) {
      const assessment = await kv.get<AssessmentRecord>(`assessment:${id}`)
      if (assessment) {
        assessments.push(assessment)
      }
    }
    
    // Sort by timestamp (newest first)
    return assessments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error('Error getting assessments:', error)
    return []
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Fallback: In-memory storage for development when KV is not available
let memoryStorage: AssessmentRecord[] = []

export async function saveAssessmentFallback(data: Omit<AssessmentRecord, 'id'>): Promise<string> {
  const id = generateId()
  const record: AssessmentRecord = { id, ...data }
  memoryStorage.push(record)
  return id
}

export async function getAssessmentsFallback(): Promise<AssessmentRecord[]> {
  return memoryStorage.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
} 
// Database utility functions
// Choose ONE of the following database options:

// Option A: JSON File Storage (Simple, for development)
import fs from 'fs/promises'
import path from 'path'

interface AssessmentRecord {
  id: string
  responses: { [key: string]: number }
  email?: string
  score: number
  maturityLevel: string
  timestamp: string
  userAgent?: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'assessments.json')

export async function saveAssessment(data: Omit<AssessmentRecord, 'id'>): Promise<string> {
  const id = generateId()
  const record: AssessmentRecord = { id, ...data }
  
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    
    // Read existing data
    let assessments: AssessmentRecord[] = []
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
      assessments = JSON.parse(fileContent)
    } catch {
      // File doesn't exist yet, start with empty array
    }
    
    // Add new record
    assessments.push(record)
    
    // Save back to file
    await fs.writeFile(DATA_FILE, JSON.stringify(assessments, null, 2))
    
    return id
  } catch (error) {
    console.error('Error saving assessment:', error)
    throw new Error('Failed to save assessment')
  }
}

export async function getAssessments(): Promise<AssessmentRecord[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return []
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Option B: MongoDB Setup (Uncomment to use)
/*
import { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    db = client.db('genai-maturity')
  }
  return { client, db }
}

export async function saveAssessment(data: Omit<AssessmentRecord, 'id'>): Promise<string> {
  const { db } = await connectToDatabase()
  const result = await db.collection('assessments').insertOne(data)
  return result.insertedId.toString()
}
*/

// Option C: Supabase Setup (Uncomment to use)
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function saveAssessment(data: Omit<AssessmentRecord, 'id'>): Promise<string> {
  const { data: result, error } = await supabase
    .from('assessments')
    .insert([data])
    .select()
  
  if (error) throw error
  return result[0].id
}
*/ 
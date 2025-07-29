// Simple storage solution that works in development
import fs from 'fs'
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

interface EmailRecord {
  id: string
  type: string
  timestamp: string
  to: string
  subject: string
  message: string
}

// Use /tmp directory which is writable on most systems
const DATA_DIR = path.join(process.cwd(), '.data')
const ASSESSMENTS_FILE = path.join(DATA_DIR, 'assessments.json')
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Read assessments from file
function readAssessments(): AssessmentRecord[] {
  try {
    ensureDataDir()
    if (fs.existsSync(ASSESSMENTS_FILE)) {
      const data = fs.readFileSync(ASSESSMENTS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('Failed to read assessments:', error)
  }
  return []
}

// Write assessments to file
function writeAssessments(assessments: AssessmentRecord[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(assessments, null, 2))
  } catch (error) {
    console.warn('Failed to write assessments:', error)
  }
}

// Read emails from file
function readEmails(): EmailRecord[] {
  try {
    ensureDataDir()
    if (fs.existsSync(EMAILS_FILE)) {
      const data = fs.readFileSync(EMAILS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('Failed to read emails:', error)
  }
  return []
}

// Write emails to file
function writeEmails(emails: EmailRecord[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2))
  } catch (error) {
    console.warn('Failed to write emails:', error)
  }
}

export async function saveAssessmentSimple(data: Omit<AssessmentRecord, 'id'>): Promise<string> {
  const id = generateId()
  const record: AssessmentRecord = { id, ...data }
  
  // Read existing assessments, add new one, write back
  const assessments = readAssessments()
  assessments.push(record)
  writeAssessments(assessments)
  
  console.log(`💾 Saved assessment ${id} to file`)
  
  return id
}

export async function getAssessmentsSimple(): Promise<AssessmentRecord[]> {
  const assessments = readAssessments()
  console.log(`📊 Retrieved ${assessments.length} assessments from file`)
  return assessments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Simple email simulation - logs to console and saves to file
export async function sendEmailResults(email: string, data: AssessmentRecord) {
  const emailContent = {
    to: email,
    subject: `Your GenAI Maturity Assessment Results - ${data.maturityLevel}`,
    message: `
Hi there!

Your GenAI Maturity Assessment is complete.

Results:
• Maturity Level: ${data.maturityLevel}
• Score: ${data.score.toFixed(2)}/4.0
• Assessment Date: ${new Date(data.timestamp).toLocaleDateString()}

Individual Responses:
• Model Selection: ${data.responses.q1}/4
• Prompt Testing: ${data.responses.q2}/4  
• Performance Monitoring: ${data.responses.q3}/4
• Model Retraining: ${data.responses.q4}/4

Thank you for using our GenAI Maturity Assessment Tool!
    `
  }
  
  // Log the email content (you can see this in server console)
  console.log('📧 EMAIL SENT:', emailContent.to, emailContent.subject)
  
  // Store the email for display in admin dashboard
  const emailRecord: EmailRecord = {
    id: generateId(),
    type: 'email',
    timestamp: new Date().toISOString(),
    ...emailContent
  }
  
  // Save email to file
  const emails = readEmails()
  emails.push(emailRecord)
  writeEmails(emails)
  
  return emailContent
}

// Get email log for admin dashboard
export function getEmailLog(): EmailRecord[] {
  const emails = readEmails()
  console.log(`📧 Retrieved ${emails.length} emails from file`)
  return emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
} 
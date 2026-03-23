// pages/api/organizer.js
import fs from 'fs'
import path from 'path'

// Disable body size limit for large HTML file
export const config = {
  api: {
    responseLimit: false,
  },
}

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'organizer.html')
    let html = fs.readFileSync(filePath, 'utf-8')

    const supaUrl = process.env.NEXT_PUBLIC_SUPA_URL
    const supaKey = process.env.NEXT_PUBLIC_SUPA_KEY

    if (!supaUrl || !supaKey) {
      console.error('Missing env vars: NEXT_PUBLIC_SUPA_URL or NEXT_PUBLIC_SUPA_KEY')
      res.status(500).send('Server configuration error: missing environment variables')
      return
    }

    html = html
      .replace(/%%NEXT_PUBLIC_SUPA_URL%%/g, supaUrl)
      .replace(/%%NEXT_PUBLIC_SUPA_KEY%%/g, supaKey)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(html)
  } catch (err) {
    console.error('Error serving organizer.html:', err)
    res.status(500).send('Error loading organizer: ' + err.message)
  }
}
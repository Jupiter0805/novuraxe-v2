// pages/api/organizer.js
import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'organizer.html')
  let html = fs.readFileSync(filePath, 'utf-8')

  html = html
    .replace(/%%NEXT_PUBLIC_SUPA_URL%%/g, process.env.NEXT_PUBLIC_SUPA_URL || '')
    .replace(/%%NEXT_PUBLIC_SUPA_KEY%%/g, process.env.NEXT_PUBLIC_SUPA_KEY || '')

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(html)
}
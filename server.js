import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Helper function to check admin token
const checkAdminToken = (req, res, next) => {
  const token = req.headers['x-admin-token']
  if (token !== 'fc7dcb7aadb20631a57fbe31c31a46273b4fb21ceab145997737c7b86c465c31') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// Ensure database files exist
const initDbFiles = () => {
  const dbPaths = [
    path.resolve(__dirname, 'src/config/users.json'),
    path.resolve(__dirname, 'src/config/tickets.json'),
    path.resolve(__dirname, 'src/config/downloads.json')
  ]
  dbPaths.forEach(p => {
    const dir = path.dirname(p)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, p.endsWith('.json') && p.includes('downloads') ? '{}' : '[]', 'utf-8')
    }
  })
}
initDbFiles()

// Database path helpers
const usersPath = path.resolve(__dirname, 'src/config/users.json')
const ticketsPath = path.resolve(__dirname, 'src/config/tickets.json')
const downloadsPath = path.resolve(__dirname, 'src/config/downloads.json')

const getUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf-8') || '[]')
const getTickets = () => JSON.parse(fs.readFileSync(ticketsPath, 'utf-8') || '[]')
const getDownloads = () => JSON.parse(fs.readFileSync(downloadsPath, 'utf-8') || '{}')

// --- API ROUTES ---

// Upload Image API
app.post('/api/upload-image', checkAdminToken, (req, res) => {
  try {
    const { filename, fileData, isLogo, logoTheme } = req.body
    const base64Content = fileData.split(';base64,').pop()
    const buffer = Buffer.from(base64Content, 'base64')
    
    if (isLogo) {
      const targetName = logoTheme === 'light' ? 'logo-light.webp' : 'logo.webp'
      const filePath = path.resolve(__dirname, 'public', targetName)
      fs.writeFileSync(filePath, buffer)
      res.json({ success: true, url: `/${targetName}` })
    } else {
      const uploadDir = path.resolve(__dirname, 'public/images/gallery')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const safeName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = path.join(uploadDir, safeName)
      fs.writeFileSync(filePath, buffer)
      res.json({ success: true, url: `/images/gallery/${safeName}` })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save packages config
app.post('/api/save-packages', checkAdminToken, (req, res) => {
  try {
    const { packages } = req.body
    const filePath = path.resolve(__dirname, 'src/config/packages.js')
    const content = `export const packages = ${JSON.stringify(packages, null, 2)}\n`
    fs.writeFileSync(filePath, content, 'utf-8')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save translations
app.post('/api/save-translations', checkAdminToken, (req, res) => {
  try {
    const { lang, translations } = req.body
    const filePath = path.resolve(__dirname, `src/i18n/${lang}.js`)
    const content = `const ${lang} = ${JSON.stringify(translations, null, 2)}\n\nexport default ${lang}\n`
    fs.writeFileSync(filePath, content, 'utf-8')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save site config
app.post('/api/save-site-config', checkAdminToken, (req, res) => {
  try {
    const { siteConfig } = req.body
    const filePath = path.resolve(__dirname, 'src/config/site.js')
    const content = `// ─── CUSTOMIZE YOUR SITE HERE ────────────────────────────────────────────────\nexport const siteConfig = ${JSON.stringify(siteConfig, null, 2)}\n`
    fs.writeFileSync(filePath, content, 'utf-8')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save gallery config
app.post('/api/save-gallery', checkAdminToken, (req, res) => {
  try {
    const { galleryImages } = req.body
    const filePath = path.resolve(__dirname, 'src/config/gallery.js')
    const content = `// ─── GALLERY CONFIGURATION ───────────────────────────────────────────────────\nexport const galleryImages = ${JSON.stringify(galleryImages, null, 2)}\n`
    fs.writeFileSync(filePath, content, 'utf-8')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- PORTAL CLIENT API ---

app.post('/api/portal/register', (req, res) => {
  try {
    const { username, email, passwordHash } = req.body
    const users = getUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kayıtlı!' })
    }
    const newUser = {
      username,
      email: email.toLowerCase(),
      passwordHash,
      purchases: [],
      created: new Date().toISOString()
    }
    users.push(newUser)
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
    res.json({ success: true, user: { username: newUser.username, email: newUser.email, purchases: newUser.purchases } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/portal/login', (req, res) => {
  try {
    const { email, passwordHash } = req.body
    const users = getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash)
    if (!user) {
      return res.status(400).json({ error: 'E-posta veya şifre hatalı!' })
    }
    if (user.isBanned) {
      return res.status(403).json({ error: 'Hesabınız yasaklanmıştır! Detaylı bilgi için yönetim ile iletişime geçin.' })
    }
    res.json({ success: true, user: { username: user.username, email: user.email, purchases: user.purchases } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/portal/get-data', (req, res) => {
  try {
    const { email } = req.body
    const users = getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' })
    }
    if (user.isBanned) {
      return res.status(403).json({ banned: true, error: 'Hesabınız askıya alınmıştır.' })
    }
    const tickets = getTickets().filter(t => t.userEmail.toLowerCase() === email.toLowerCase())
    const downloads = getDownloads()
    res.json({ success: true, user: { username: user.username, email: user.email, purchases: user.purchases }, tickets, downloads })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/portal/create-ticket', (req, res) => {
  try {
    const { email, username, title, category, text } = req.body
    const users = getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (user && user.isBanned) {
      return res.status(403).json({ error: 'Yasaklı hesaplar işlem yapamaz!' })
    }
    const tickets = getTickets()
    const newTicket = {
      id: `ticket_${Date.now()}`,
      userEmail: email.toLowerCase(),
      username,
      title,
      category,
      status: 'open',
      created: new Date().toISOString(),
      messages: [
        {
          role: 'client',
          sender: username,
          text,
          time: new Date().toISOString()
        }
      ]
    }
    tickets.push(newTicket)
    fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2))
    res.json({ success: true, ticket: newTicket })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/portal/reply-ticket', (req, res) => {
  try {
    const { ticketId, sender, role, text, status } = req.body
    const tickets = getTickets()
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) {
      return res.status(404).json({ error: 'Bilet bulunamadı!' })
    }
    if (role === 'client') {
      const users = getUsers()
      const user = users.find(u => u.email.toLowerCase() === ticket.userEmail.toLowerCase())
      if (user && user.isBanned) {
        return res.status(403).json({ error: 'Yasaklı hesaplar işlem yapamaz!' })
      }
    }
    if (text) {
      ticket.messages.push({
        role,
        sender,
        text,
        time: new Date().toISOString()
      })
    }
    ticket.status = status || (role === 'support' ? 'answered' : 'open')
    fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2))
    res.json({ success: true, ticket })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- ADMIN PORTAL API ---

app.post('/api/admin/get-portal-data', checkAdminToken, (req, res) => {
  try {
    res.json({ success: true, users: getUsers(), tickets: getTickets(), downloads: getDownloads() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/save-downloads', checkAdminToken, (req, res) => {
  try {
    const { downloads } = req.body
    fs.writeFileSync(downloadsPath, JSON.stringify(downloads, null, 2))
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/update-user-purchases', checkAdminToken, (req, res) => {
  try {
    const { email, purchases } = req.body
    const users = getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' })
    }
    user.purchases = purchases
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/save-user-details', checkAdminToken, (req, res) => {
  try {
    const { email, username, newEmail, passwordHash } = req.body
    const users = getUsers()
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' })
    }

    if (newEmail.toLowerCase() !== email.toLowerCase()) {
      if (users.some((u, idx) => idx !== userIndex && u.email.toLowerCase() === newEmail.toLowerCase())) {
        return res.status(400).json({ error: 'Bu yeni e-posta adresi başka bir kullanıcı tarafından kullanılıyor!' })
      }
      
      const tickets = getTickets()
      tickets.forEach(t => {
        if (t.userEmail.toLowerCase() === email.toLowerCase()) {
          t.userEmail = newEmail.toLowerCase()
        }
      })
      fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2))
    }

    users[userIndex].username = username
    users[userIndex].email = newEmail.toLowerCase()
    if (passwordHash) {
      users[userIndex].passwordHash = passwordHash
    }

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/delete-user', checkAdminToken, (req, res) => {
  try {
    const { email } = req.body
    const users = getUsers()
    const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase())
    if (users.length === filteredUsers.length) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' })
    }
    
    fs.writeFileSync(usersPath, JSON.stringify(filteredUsers, null, 2))
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/create-user', checkAdminToken, (req, res) => {
  try {
    const { username, email, passwordHash } = req.body
    const users = getUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kayıtlı!' })
    }

    const newUser = {
      username,
      email: email.toLowerCase(),
      passwordHash,
      purchases: [],
      created: new Date().toISOString()
    }
    users.push(newUser)
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/toggle-user-ban', checkAdminToken, (req, res) => {
  try {
    const { email } = req.body
    const users = getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' })
    }
    user.isBanned = !user.isBanned
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
    res.json({ success: true, isBanned: user.isBanned })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Serve Static Files from Vite build
app.use(express.static(path.resolve(__dirname, 'dist')))

// SPA Routing - Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'))
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/upload-image') {
          const token = req.headers['x-admin-token']
          if (token !== 'fc7dcb7aadb20631a57fbe31c31a46273b4fb21ceab145997737c7b86c465c31') {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Unauthorized' }))
            return
          }
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const { filename, fileData, isLogo, logoTheme } = JSON.parse(body)
              const base64Content = fileData.split(';base64,').pop()
              const buffer = Buffer.from(base64Content, 'base64')
              
              if (isLogo) {
                const targetName = logoTheme === 'light' ? 'logo-light.webp' : 'logo.webp'
                const filePath = path.resolve(__dirname, 'public', targetName)
                fs.writeFileSync(filePath, buffer)
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, url: `/${targetName}` }))
              } else {
                const uploadDir = path.resolve(__dirname, 'public/images/gallery')
                if (!fs.existsSync(uploadDir)) {
                  fs.mkdirSync(uploadDir, { recursive: true })
                }
                
                const safeName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
                const filePath = path.join(uploadDir, safeName)
                fs.writeFileSync(filePath, buffer)
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, url: `/images/gallery/${safeName}` }))
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'POST' && (req.url === '/api/save-packages' || req.url === '/api/save-translations' || req.url === '/api/save-site-config' || req.url === '/api/save-gallery')) {
          const token = req.headers['x-admin-token']
          if (token !== 'fc7dcb7aadb20631a57fbe31c31a46273b4fb21ceab145997737c7b86c465c31') {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Unauthorized' }))
            return
          }
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              
              if (req.url === '/api/save-packages') {
                const filePath = path.resolve(__dirname, 'src/config/packages.js')
                const content = `export const packages = ${JSON.stringify(data.packages, null, 2)}\n`
                fs.writeFileSync(filePath, content, 'utf-8')
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } else if (req.url === '/api/save-translations') {
                const { lang, translations } = data
                const filePath = path.resolve(__dirname, `src/i18n/${lang}.js`)
                const content = `const ${lang} = ${JSON.stringify(translations, null, 2)}\n\nexport default ${lang}\n`
                fs.writeFileSync(filePath, content, 'utf-8')
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } else if (req.url === '/api/save-site-config') {
                const filePath = path.resolve(__dirname, 'src/config/site.js')
                const content = `// ─── CUSTOMIZE YOUR SITE HERE ────────────────────────────────────────────────\nexport const siteConfig = ${JSON.stringify(data.siteConfig, null, 2)}\n`
                fs.writeFileSync(filePath, content, 'utf-8')
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } else if (req.url === '/api/save-gallery') {
                const filePath = path.resolve(__dirname, 'src/config/gallery.js')
                const content = `// ─── GALLERY CONFIGURATION ───────────────────────────────────────────────────\nexport const galleryImages = ${JSON.stringify(data.galleryImages, null, 2)}\n`
                fs.writeFileSync(filePath, content, 'utf-8')
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'POST' && req.url.startsWith('/api/portal/')) {
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const usersPath = path.resolve(__dirname, 'src/config/users.json')
              const ticketsPath = path.resolve(__dirname, 'src/config/tickets.json')
              const downloadsPath = path.resolve(__dirname, 'src/config/downloads.json')

              const getUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf-8') || '[]')
              const getTickets = () => JSON.parse(fs.readFileSync(ticketsPath, 'utf-8') || '[]')
              const getDownloads = () => JSON.parse(fs.readFileSync(downloadsPath, 'utf-8') || '{}')

              if (req.url === '/api/portal/register') {
                const { username, email, passwordHash } = data
                const users = getUsers()
                if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Bu e-posta adresi zaten kayıtlı!' }))
                  return
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
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, user: { username: newUser.username, email: newUser.email, purchases: newUser.purchases } }))
              } 
              else if (req.url === '/api/portal/login') {
                const { email, passwordHash } = data
                const users = getUsers()
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash)
                if (!user) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'E-posta veya şifre hatalı!' }))
                  return
                }
                if (user.isBanned) {
                  res.writeHead(403, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Hesabınız yasaklanmıştır! Detaylı bilgi için yönetim ile iletişime geçin.' }))
                  return
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, user: { username: user.username, email: user.email, purchases: user.purchases } }))
              } 
              else if (req.url === '/api/portal/get-data') {
                const { email } = data
                const users = getUsers()
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (!user) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Kullanıcı bulunamadı!' }))
                  return
                }
                if (user.isBanned) {
                  res.writeHead(403, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ banned: true, error: 'Hesabınız askıya alınmıştır.' }))
                  return
                }
                const tickets = getTickets().filter(t => t.userEmail.toLowerCase() === email.toLowerCase())
                const downloads = getDownloads()
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, user: { username: user.username, email: user.email, purchases: user.purchases }, tickets, downloads }))
              }
              else if (req.url === '/api/portal/create-ticket') {
                const { email, username, title, category, text } = data
                const users = getUsers()
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (user && user.isBanned) {
                  res.writeHead(403, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Yasaklı hesaplar işlem yapamaz!' }))
                  return
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
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, ticket: newTicket }))
              }
              else if (req.url === '/api/portal/reply-ticket') {
                const { ticketId, sender, role, text, status } = data
                const tickets = getTickets()
                const ticket = tickets.find(t => t.id === ticketId)
                if (!ticket) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Bilet bulunamadı!' }))
                  return
                }
                if (role === 'client') {
                  const users = getUsers()
                  const user = users.find(u => u.email.toLowerCase() === ticket.userEmail.toLowerCase())
                  if (user && user.isBanned) {
                    res.writeHead(403, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Yasaklı hesaplar işlem yapamaz!' }))
                    return
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
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, ticket }))
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'POST' && req.url.startsWith('/api/admin/')) {
          const token = req.headers['x-admin-token']
          if (token !== 'fc7dcb7aadb20631a57fbe31c31a46273b4fb21ceab145997737c7b86c465c31') {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Unauthorized' }))
            return
          }
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const data = body ? JSON.parse(body) : {}
              const usersPath = path.resolve(__dirname, 'src/config/users.json')
              const ticketsPath = path.resolve(__dirname, 'src/config/tickets.json')
              const downloadsPath = path.resolve(__dirname, 'src/config/downloads.json')

              const getUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf-8') || '[]')
              const getTickets = () => JSON.parse(fs.readFileSync(ticketsPath, 'utf-8') || '[]')
              const getDownloads = () => JSON.parse(fs.readFileSync(downloadsPath, 'utf-8') || '{}')

              if (req.url === '/api/admin/get-portal-data') {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, users: getUsers(), tickets: getTickets(), downloads: getDownloads() }))
              }
              else if (req.url === '/api/admin/save-downloads') {
                fs.writeFileSync(downloadsPath, JSON.stringify(data.downloads, null, 2))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
              else if (req.url === '/api/admin/update-user-purchases') {
                const { email, purchases } = data
                const users = getUsers()
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (!user) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Kullanıcı bulunamadı!' }))
                  return
                }
                user.purchases = purchases
                fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
              else if (req.url === '/api/admin/save-user-details') {
                const { email, username, newEmail, passwordHash } = data
                const users = getUsers()
                const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
                if (userIndex === -1) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Kullanıcı bulunamadı!' }))
                  return
                }

                if (newEmail.toLowerCase() !== email.toLowerCase()) {
                  if (users.some((u, idx) => idx !== userIndex && u.email.toLowerCase() === newEmail.toLowerCase())) {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Bu yeni e-posta adresi başka bir kullanıcı tarafından kullanılıyor!' }))
                    return
                  }
                  
                  // Also update tickets user email to maintain chat history
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
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
              else if (req.url === '/api/admin/delete-user') {
                const { email } = data
                const users = getUsers()
                const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase())
                if (users.length === filteredUsers.length) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Kullanıcı bulunamadı!' }))
                  return
                }
                
                fs.writeFileSync(usersPath, JSON.stringify(filteredUsers, null, 2))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
              else if (req.url === '/api/admin/create-user') {
                const { username, email, passwordHash } = data
                const users = getUsers()
                if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Bu e-posta adresi zaten kayıtlı!' }))
                  return
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
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
              else if (req.url === '/api/admin/toggle-user-ban') {
                const { email } = data
                const users = getUsers()
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (!user) {
                  res.writeHead(404, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Kullanıcı bulunamadı!' }))
                  return
                }
                user.isBanned = !user.isBanned
                fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, isBanned: user.isBanned }))
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
})

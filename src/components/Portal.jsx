import { useState, useEffect } from 'react'
import { packages as allPackages } from '../config/packages'
import { useLang } from '../context/LanguageContext'

// Simple Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`admin-toast ${type}`} style={{ zIndex: 110000 }}>
      <span>{message}</span>
    </div>
  )
}

// Client-side password hashing
async function hashPassword(input) {
  const msgBuffer = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const localT = {
  tr: {
    loginTitle: "MÜŞTERİ PORTALI GİRİŞİ",
    registerTitle: "YENİ HESAP KAYDI",
    loginBtn: "Giriş Yap",
    registerBtn: "Kayıt Ol",
    usernameLabel: "KULLANICI ADI",
    usernamePlaceholder: "Kullanıcı adınızı girin",
    emailLabel: "E-POSTA ADRESİ",
    emailPlaceholder: "ornek@arven.com",
    passwordLabel: "ŞİFRE",
    fillAll: "Lütfen tüm alanları doldurun!",
    loginSuccess: "Başarıyla giriş yapıldı!",
    registerSuccess: "Kayıt başarılı! Giriş yapıldı.",
    logoutSuccess: "Çıkış yapıldı.",
    logoutBtn: "Çıkış Yap",
    demoAccount: "Test Girişi",
    
    // Sidebar
    clientPortal: "MÜŞTERİ PANELİ",
    myLibrary: "📦 Kütüphanem",
    myTickets: "💬 Destek Taleplerim",
    myProfile: "👤 Profil & Hesap",
    
    // Library
    libraryTitle: "📦 SATIN ALINAN PAKETLERİM",
    libraryDesc: "Satın almış olduğunuz paketlerin indirme bağlantılarına ve güncelleme sürüm loglarına buradan ulaşabilirsiniz.",
    downloadBtn: "⬇️ İndir",
    updatesBtn: "📜 Güncellemeler",
    emptyLibraryTitle: "Kütüphaneniz Henüz Boş!",
    emptyLibraryDesc: "Satın aldığınız paketlerin kütüphanenize tanımlanması için Tebex fatura mailinizi veya ödeme kanıtınızı belirterek bir destek talebi (ticket) oluşturabilirsiniz.",
    createTicketBtn: "Destek Talebi Oluştur",
    noDownloadLink: "Bu ürün için indirme bağlantısı henüz yüklenmemiş. Lütfen daha sonra tekrar deneyin veya ticket açın.",
    
    // Tickets list
    ticketsTitle: "💬 DESTEK TALEPLERİM",
    ticketsDesc: "Bizimle iletişime geçin. Talepleriniz en kısa sürede yanıtlanacaktır.",
    newTicketBtn: "+ Yeni Destek Talebi",
    ticketIdCol: "Bilet ID",
    titleCol: "Konu / Başlık",
    categoryCol: "Kategori",
    statusCol: "Durum",
    dateCol: "Tarih",
    actionCol: "İşlem",
    openMsgs: "Mesajları Aç",
    emptyTickets: "Henüz destek talebiniz bulunmuyor. Yardıma ihtiyacınız varsa yeni bilet oluşturabilirsiniz.",
    
    // New Ticket Form
    newTicketTitle: "YENİ DESTEK TALEBİ AÇ",
    cancelBtn: "Vazgeç",
    ticketTitleLabel: "TALEP BAŞLIĞI",
    ticketTitlePlaceholder: "Sorunu kısaca özetleyin (Örn: v7 Kurulum Hatası)",
    categoryLabel: "KATEGORİ",
    cat1: "🛠️ Teknik Destek",
    cat2: "💳 Faturalandırma & Satın Alım",
    cat3: "🎨 Özel Tasarım Talebi",
    cat4: "❓ Diğer",
    descLabel: "DETAYLI AÇIKLAMA",
    descPlaceholder: "Yardım almak istediğiniz konuyu detaylıca açıklayın...",
    sendTicketBtn: "Talebi Gönder",
    emptyFieldsErr: "Bilet başlığı ve mesajı boş bırakılamaz!",
    
    // Chat pane
    backToTickets: "← Taleplere Dön",
    statusResolved: "Çözüldü",
    statusAnswered: "Yanıtlandı",
    statusOpen: "Açık",
    resolvedAlert: "🔒 Bu destek talebi admin tarafından çözüldü olarak işaretlendiği için kapatılmıştır.",
    replyPlaceholder: "Bir yanıt yazın...",
    sendReplyBtn: "Gönder",
    replyErr: "Mesaj gönderilemedi!",
    
    // Profile
    profileTitle: "👤 HESAP BİLGİLERİ",
    profileDesc: "Kullanıcı profiliniz ve hesap kayıt ayrıntıları.",
    usernameProfile: "KULLANICI ADI",
    emailProfile: "KAYITLI E-POSTA",
    purchasesCount: "KÜTÜPHANEDEKİ ÜRÜN SAYISI",
    purchasesCountVal: "Ürün",
    accountType: "HESAP HİZMET TİPİ",
    premiumClient: "🏆 Premium Müşteri",
    standardMember: "👤 Standart Üye",
    logoutProfileBtn: "Hesaptan Güvenli Çıkış Yap",
    
    // Changelog Modal
    updatesModalTitle: "📜 SÜRÜM & GÜNCELLEME GEÇMİŞİ",
    noUpdatesYet: "Bu ürün için henüz bir sürüm güncelleme geçmişi girilmemiş.",
    changeAvatar: "Profil Resmini Değiştir",
    avatarSuccess: "Profil resmi başarıyla güncellendi!",
    avatarError: "Profil resmi yüklenirken hata oluştu!",
    avatarSizeErr: "Profil resmi boyutu 2MB'tan küçük olmalıdır!",
    uploading: "Yükleniyor..."
  },
  en: {
    loginTitle: "CLIENT PORTAL LOGIN",
    registerTitle: "NEW ACCOUNT REGISTRATION",
    loginBtn: "Login",
    registerBtn: "Register",
    usernameLabel: "USERNAME",
    usernamePlaceholder: "Enter your username",
    emailLabel: "EMAIL ADDRESS",
    emailPlaceholder: "example@arven.com",
    passwordLabel: "PASSWORD",
    fillAll: "Please fill in all fields!",
    loginSuccess: "Successfully logged in!",
    registerSuccess: "Registration successful! Logged in.",
    logoutSuccess: "Logged out.",
    logoutBtn: "Logout",
    demoAccount: "Demo Login",
    
    // Sidebar
    clientPortal: "CLIENT PORTAL",
    myLibrary: "📦 My Library",
    myTickets: "💬 Support Tickets",
    myProfile: "👤 Profile & Account",
    
    // Library
    libraryTitle: "📦 MY PURCHASED PACKAGES",
    libraryDesc: "Access download links and version changelogs of your purchased packages here.",
    downloadBtn: "⬇️ Download",
    updatesBtn: "📜 Changelogs",
    emptyLibraryTitle: "Your Library is Empty!",
    emptyLibraryDesc: "To link purchased packages to your library, open a support ticket specifying your Tebex invoice email or proof of payment.",
    createTicketBtn: "Create Support Ticket",
    noDownloadLink: "Download link is not available for this product yet. Please try again later or open a ticket.",
    
    // Tickets list
    ticketsTitle: "💬 SUPPORT TICKETS",
    ticketsDesc: "Get in touch with us. Your tickets will be answered as soon as possible.",
    newTicketBtn: "+ New Support Ticket",
    ticketIdCol: "Ticket ID",
    titleCol: "Subject / Title",
    categoryCol: "Category",
    statusCol: "Status",
    dateCol: "Date",
    actionCol: "Action",
    openMsgs: "Open Messages",
    emptyTickets: "You do not have any support tickets yet. You can create a new ticket if you need assistance.",
    
    // New Ticket Form
    newTicketTitle: "OPEN NEW SUPPORT TICKET",
    cancelBtn: "Cancel",
    ticketTitleLabel: "TICKET TITLE",
    ticketTitlePlaceholder: "Briefly summarize the issue (e.g., v7 Installation Error)",
    categoryLabel: "CATEGORY",
    cat1: "🛠️ Technical Support",
    cat2: "💳 Billing & Tebex",
    cat3: "🎨 Custom Design Request",
    cat4: "❓ Other",
    descLabel: "DETAILED DESCRIPTION",
    descPlaceholder: "Describe the issue you need help with in detail...",
    sendTicketBtn: "Submit Ticket",
    emptyFieldsErr: "Ticket title and message cannot be empty!",
    
    // Chat pane
    backToTickets: "← Back to Tickets",
    statusResolved: "Resolved",
    statusAnswered: "Answered",
    statusOpen: "Open",
    resolvedAlert: "🔒 This support ticket has been closed and marked as resolved by support.",
    replyPlaceholder: "Type a response...",
    sendReplyBtn: "Send",
    replyErr: "Message could not be sent!",
    
    // Profile
    profileTitle: "👤 ACCOUNT INFORMATION",
    profileDesc: "Your user profile and registration details.",
    usernameProfile: "USERNAME",
    emailProfile: "REGISTERED EMAIL",
    purchasesCount: "ITEMS IN LIBRARY",
    purchasesCountVal: "Items",
    accountType: "ACCOUNT MEMBERSHIP TYPE",
    premiumClient: "🏆 Premium Customer",
    standardMember: "👤 Standard Member",
    logoutProfileBtn: "Secure Log Out of Account",
    
    // Changelog Modal
    updatesModalTitle: "📜 VERSION & UPDATE HISTORY",
    noUpdatesYet: "No update logs have been entered for this product yet.",
    changeAvatar: "Change Profile Picture",
    avatarSuccess: "Profile picture updated successfully!",
    avatarError: "Failed to upload profile picture!",
    avatarSizeErr: "Profile picture must be under 2MB!",
    uploading: "Uploading..."
  }
}

export default function Portal() {
  const { lang } = useLang()
  const pt = localT[lang] || localT.tr

  const [isLogin, setIsLogin] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState(null)
  const [isBanned, setIsBanned] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('portal_user')
    return saved ? JSON.parse(saved) : null
  })

  // Dashboard state
  const [activeTab, setActiveTab] = useState('library') // 'library' | 'tickets' | 'profile'
  const [tickets, setTickets] = useState([])
  const [downloads, setDownloads] = useState({})
  const [selectedTicket, setSelectedTicket] = useState(null)
  
  // Modal states
  const [selectedProductUpdates, setSelectedProductUpdates] = useState(null) // product object with downloads config
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  
  // Form states for tickets
  const [ticketTitle, setTicketTitle] = useState('')
  const [ticketCategory, setTicketCategory] = useState(pt.cat1)
  const [ticketMessage, setTicketMessage] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Sync translation defaults for category selection
  useEffect(() => {
    setTicketCategory(pt.cat1)
  }, [lang])

  // Load user data (tickets, library downloads)
  const loadPortalData = async (email) => {
    try {
      const res = await fetch('/api/portal/get-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const result = await res.json()
      if (result.banned) {
        setIsBanned(true)
        return
      }
      if (result.success) {
        setIsBanned(false)
        setTickets(result.tickets)
        setDownloads(result.downloads)
        // Sync purchases list
        const updatedUser = { ...currentUser, purchases: result.user.purchases }
        setCurrentUser(updatedUser)
        localStorage.setItem('portal_user', JSON.stringify(updatedUser))

        // If ticket selected, update it
        if (selectedTicket) {
          const freshTicket = result.tickets.find(t => t.id === selectedTicket.id)
          if (freshTicket) setSelectedTicket(freshTicket)
        }
      }
    } catch (err) {
      console.error('Veri yükleme hatası:', err)
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadPortalData(currentUser.email)
      
      // Auto-poll tickets every 10 seconds for replies
      const timer = setInterval(() => {
        loadPortalData(currentUser.email)
      }, 10000)
      return () => clearInterval(timer)
    }
  }, [currentUser?.email, selectedTicket?.id])

  const handleAuth = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    const email = emailInput.trim()
    const username = usernameInput.trim()
    const password = passwordInput

    if (!email || !password || (!isLogin && !username)) {
      setErrorMsg(pt.fillAll)
      return
    }

    try {
      const passwordHash = await hashPassword(password)
      const endpoint = isLogin ? '/api/portal/login' : '/api/portal/register'
      const payload = isLogin 
        ? { email, passwordHash }
        : { username, email, passwordHash }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (result.success) {
        localStorage.setItem('portal_user', JSON.stringify(result.user))
        setCurrentUser(result.user)
        showToast(isLogin ? pt.loginSuccess : pt.registerSuccess, 'success')
        setEmailInput('')
        setUsernameInput('')
        setPasswordInput('')
      } else {
        setErrorMsg(result.error || 'İşlem başarısız oldu.')
      }
    } catch (err) {
      setErrorMsg('Bağlantı hatası!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('portal_user')
    setCurrentUser(null)
    setSelectedTicket(null)
    setActiveTab('library')
    showToast(pt.logoutSuccess, 'info')
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!ticketTitle.trim() || !ticketMessage.trim()) {
      showToast(pt.emptyFieldsErr, 'error')
      return
    }

    try {
      const res = await fetch('/api/portal/create-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          username: currentUser.username,
          title: ticketTitle.trim(),
          category: ticketCategory,
          text: ticketMessage.trim()
        })
      })

      const result = await res.json()
      if (result.success) {
        showToast('Destek bileti oluşturuldu!', 'success')
        setIsCreatingTicket(false)
        setTicketTitle('')
        setTicketMessage('')
        loadPortalData(currentUser.email)
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Sunucu hatası!', 'error')
    }
  }

  const handleReplyTicket = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    try {
      const res = await fetch('/api/portal/reply-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          sender: currentUser.username,
          role: 'client',
          text: replyMessage.trim()
        })
      })

      const result = await res.json()
      if (result.success) {
        setReplyMessage('')
        setSelectedTicket(result.ticket)
        loadPortalData(currentUser.email)
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast(pt.replyErr, 'error')
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast(pt.avatarSizeErr, 'error')
      return
    }
    try {
      setIsUploadingAvatar(true)
      const fileUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/portal/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          filename: file.name,
          fileData: fileUrl
        })
      })
      const result = await res.json()
      if (result.success) {
        const updatedUser = { ...currentUser, profilePic: result.profilePic }
        setCurrentUser(updatedUser)
        localStorage.setItem('portal_user', JSON.stringify(updatedUser))
        showToast(pt.avatarSuccess, 'success')
      } else {
        showToast(result.error || pt.avatarError, 'error')
      }
    } catch (err) {
      showToast(pt.avatarError, 'error')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Filter products that user has purchased
  const userPurchases = allPackages.filter(pack => 
    currentUser?.purchases?.includes(pack.id)
  )

  return (
    <div className="portal-container" style={{ minHeight: 'calc(100vh - 120px)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic inline styles for the modern dashboard theme */}
      <style>{`
        @keyframes portalPulse {
          0% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.15); }
          50% { box-shadow: 0 0 35px rgba(245, 158, 11, 0.35); }
          100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.15); }
        }
        @keyframes portalBgGrad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .portal-glass-panel {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }
        .portal-glow-card {
          background: rgba(18, 18, 18, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(245, 158, 11, 0.2);
          animation: portalPulse 4s infinite alternate;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }
        .portal-menu-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1.25rem;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.825rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-align: left;
          width: 100%;
        }
        .portal-menu-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          padding-left: 1.5rem;
        }
        .portal-menu-btn.active {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.02) 100%);
          border-left: 3px solid var(--accent);
          color: var(--accent);
          padding-left: calc(1.5rem - 3px);
          box-shadow: inset 2px 0 8px rgba(245, 158, 11, 0.05);
        }
        .portal-item-card {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(10, 10, 10, 0.4);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .portal-item-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          background: rgba(15, 15, 15, 0.65);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.15);
        }
        .portal-img-zoom {
          width: 100%;
          height: 150px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }
        .portal-img-zoom img {
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .portal-item-card:hover .portal-img-zoom img {
          transform: scale(1.1);
        }
        .portal-input-glow {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          padding: 0.85rem 1.1rem;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.3s ease;
          width: 100%;
        }
        .portal-input-glow:focus {
          border-color: var(--accent);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
          background: rgba(0, 0, 0, 0.6);
        }
        .portal-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }
      `}</style>

      {/* BACKGROUND DECORATIVE GLOWS */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {!currentUser ? (
        // Futuristic Login / Register Panel
        <div className="container-site" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
          <div className="portal-glow-card" style={{ width: '100%', maxWidth: '450px', padding: '2.75rem', borderRadius: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.25rem' }}>
              <div>
                <h2 className="font-display font-bold text-gradient" style={{ fontSize: '1.35rem', letterSpacing: '0.05em', margin: 0 }}>
                  {isLogin ? pt.loginTitle : pt.registerTitle}
                </h2>
                <div style={{ width: '40px', height: '3px', background: 'var(--accent)', marginTop: '0.5rem', borderRadius: '2px' }} />
              </div>
              <button 
                onClick={() => { setIsLogin(!isLogin); setErrorMsg('') }}
                className="btn-ghost"
                style={{ fontSize: '0.75rem', padding: '0.45rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {isLogin ? pt.registerBtn : pt.loginBtn}
              </button>
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {!isLogin && (
                <div>
                  <label className="admin-field-label" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>{pt.usernameLabel}</label>
                  <input
                    type="text"
                    className="portal-input-glow"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder={pt.usernamePlaceholder}
                    required
                  />
                </div>
              )}
              <div>
                <label className="admin-field-label" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>{pt.emailLabel}</label>
                <input
                  type="email"
                  className="portal-input-glow"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder={pt.emailPlaceholder}
                  required
                />
              </div>
              <div>
                <label className="admin-field-label" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>{pt.passwordLabel}</label>
                <input
                  type="password"
                  className="portal-input-glow"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {errorMsg && <p className="admin-login-error" style={{ margin: 0, fontSize: '0.78rem' }}>⚠️ {errorMsg}</p>}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', padding: '0.9rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                {isLogin ? pt.loginBtn : pt.registerBtn}
              </button>
            </form>

            <div style={{ marginTop: '2.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'rgba(245, 158, 11, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.1)' }}>
                💡 {pt.demoAccount}: <strong>demo@arven.com</strong> / <strong>demo123</strong>
              </span>
            </div>
          </div>
        </div>
      ) : isBanned ? (
        // Suspended Account Screen
        <div className="container-site" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
          <div className="portal-glow-card" style={{ width: '100%', maxWidth: '450px', padding: '2.75rem', borderRadius: '24px', textAlign: 'center', borderColor: '#ef4444', animation: 'none', boxShadow: '0 0 25px rgba(239, 68, 68, 0.2)' }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.25rem' }}>🚫</span>
            <h2 className="font-display font-bold" style={{ fontSize: '1.25rem', color: '#ef4444', letterSpacing: '0.05em', margin: '0 0 1rem' }}>
              HESABINIZ ASKIYA ALINDI
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2rem' }}>
              {lang === 'en' 
                ? 'Your account has been suspended by the administration. If you think this is a mistake, please contact support.' 
                : 'Hesabınız yönetim tarafından askıya alınmıştır. Bunun bir hata olduğunu düşünüyorsanız lütfen yönetim ile iletişime geçin.'}
            </p>
            <button onClick={handleLogout} className="admin-logout-btn" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px' }}>
              🚪 {pt.logoutBtn}
            </button>
          </div>
        </div>
      ) : (
        // Premium Client Dashboard Dashboard Layout
        <div className="container-site" style={{ minHeight: 'calc(100vh - 120px)', padding: '7.5rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
            
            {/* Elegant Left Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="portal-glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div className="portal-sidebar-avatar">
                    {currentUser.profilePic ? (
                      <img src={currentUser.profilePic} alt="" className="portal-sidebar-avatar-img" />
                    ) : (
                      <div className="portal-sidebar-avatar-placeholder">
                        {currentUser.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentUser.username}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentUser.email}</div>
                  </div>
                </div>
                
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                
                <div style={{ fontSize: '0.625rem', color: 'var(--accent)', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pt.clientPortal}</div>
              </div>

              {/* Sidebar Menu Links */}
              <div className="portal-glass-panel" style={{ padding: '0.75rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <button
                  onClick={() => { setActiveTab('library'); setSelectedTicket(null) }}
                  className={`portal-menu-btn ${activeTab === 'library' ? 'active' : ''}`}
                >
                  {pt.myLibrary}
                </button>
                <button
                  onClick={() => { setActiveTab('tickets'); setSelectedTicket(null) }}
                  className={`portal-menu-btn ${activeTab === 'tickets' ? 'active' : ''}`}
                >
                  {pt.myTickets}
                </button>
                <button
                  onClick={() => { setActiveTab('profile'); setSelectedTicket(null) }}
                  className={`portal-menu-btn ${activeTab === 'profile' ? 'active' : ''}`}
                >
                  {pt.myProfile}
                </button>
                
                <div style={{ margin: '0.75rem 0', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                
                <button
                  onClick={handleLogout}
                  className="admin-logout-btn"
                  style={{ borderRadius: '12px', width: '100%', textAlign: 'left', padding: '0.85rem 1.25rem', fontSize: '0.825rem' }}
                >
                  🚪 {pt.logoutBtn}
                </button>
              </div>
            </aside>

            {/* Right Workspaces */}
            <main>
              {/* TAB 1: Kütüphane & Satın Alınan Paketler */}
              {activeTab === 'library' && (
                <div className="portal-glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', animation: 'tabFadeIn 0.3s ease' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
                    <h3 className="font-display font-bold text-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>{pt.libraryTitle}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>{pt.libraryDesc}</p>
                  </div>

                  {userPurchases.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
                      {userPurchases.map(pack => {
                        const packDl = downloads[pack.id] || {}
                        return (
                          <div key={pack.id} className="portal-item-card">
                            <div className="portal-img-zoom">
                              <img src={pack.images[0]} alt={pack.name[lang] || pack.name.tr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                ID: {pack.id}
                              </div>
                            </div>
                            
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', minHeight: '38px', margin: 0 }}>
                              {lang === 'en' && pack.name.en ? pack.name.en : pack.name.tr}
                            </h4>
                            
                            <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
                              <a 
                                href={packDl.downloadUrl || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`btn-primary ${!packDl.downloadUrl ? 'disabled' : ''}`}
                                style={{ flex: 1, padding: '0.6rem', fontSize: '0.75rem', borderRadius: '10px', justifyContent: 'center' }}
                                onClick={e => {
                                  if (!packDl.downloadUrl) {
                                    e.preventDefault()
                                    showToast(pt.noDownloadLink, 'info')
                                  }
                                }}
                              >
                                {pt.downloadBtn}
                              </a>
                              <button
                                type="button"
                                onClick={() => setSelectedProductUpdates({ pack, dl: packDl })}
                                className="btn-ghost"
                                style={{ padding: '0.6rem', fontSize: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}
                              >
                                {pt.updatesBtn}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px dashed rgba(255, 255, 255, 0.08)', borderRadius: '16px', background: 'rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1.25rem' }}>🛍️</span>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.4rem' }}>{pt.emptyLibraryTitle}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.4 }}>
                        {pt.emptyLibraryDesc}
                      </p>
                      <button onClick={() => { setActiveTab('tickets'); setIsCreatingTicket(true) }} className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.78rem', borderRadius: '10px' }}>
                        {pt.createTicketBtn}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Destek Talepleri (Tickets) */}
              {activeTab === 'tickets' && !selectedTicket && (
                <div className="portal-glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', animation: 'tabFadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
                    <div>
                      <h3 className="font-display font-bold text-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>{pt.ticketsTitle}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>{pt.ticketsDesc}</p>
                    </div>
                    {!isCreatingTicket && (
                      <button onClick={() => setIsCreatingTicket(true)} className="btn-primary" style={{ padding: '0.7rem 1.4rem', fontSize: '0.8rem', borderRadius: '10px' }}>
                        {pt.newTicketBtn}
                      </button>
                    )}
                  </div>

                  {isCreatingTicket ? (
                    <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>{pt.newTicketTitle}</h4>
                        <button type="button" onClick={() => setIsCreatingTicket(false)} className="admin-close-form-btn" style={{ fontSize: '0.75rem' }}>{pt.cancelBtn}</button>
                      </div>
                      <div>
                        <label className="admin-field-label" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>{pt.ticketTitleLabel}</label>
                        <input
                          type="text"
                          className="portal-input-glow"
                          value={ticketTitle}
                          onChange={e => setTicketTitle(e.target.value)}
                          placeholder={pt.ticketTitlePlaceholder}
                          required
                        />
                      </div>
                      <div>
                        <label className="admin-field-label" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>{pt.categoryLabel}</label>
                        <select
                          className="portal-input-glow"
                          value={ticketCategory}
                          onChange={e => setTicketCategory(e.target.value)}
                          style={{ appearance: 'none' }}
                        >
                          <option value="Teknik Destek">🛠️ {pt.cat1}</option>
                          <option value="Faturalandırma & Tebex">💳 {pt.cat2}</option>
                          <option value="Özel Giysi İstekleri">🎨 {pt.cat3}</option>
                          <option value="Diğer Sorular">❓ {pt.cat4}</option>
                        </select>
                      </div>
                      <div>
                        <label className="admin-field-label" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>{pt.descLabel}</label>
                        <textarea
                          rows="5"
                          className="portal-input-glow"
                          value={ticketMessage}
                          onChange={e => setTicketMessage(e.target.value)}
                          placeholder={pt.descPlaceholder}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.85rem 2.25rem', borderRadius: '10px' }}>
                        {pt.sendTicketBtn}
                      </button>
                    </form>
                  ) : (
                    <div className="admin-table-scroll-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>{pt.ticketIdCol}</th>
                            <th>{pt.titleCol}</th>
                            <th>{pt.categoryCol}</th>
                            <th>{pt.statusCol}</th>
                            <th>{pt.dateCol}</th>
                            <th style={{ textAlign: 'right' }}>{pt.actionCol}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tickets.map(ticket => (
                            <tr key={ticket.id}>
                              <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{ticket.id.substring(0, 12)}</td>
                              <td style={{ fontWeight: 600 }}>{ticket.title}</td>
                              <td>{ticket.category}</td>
                              <td>
                                <span 
                                  className="portal-badge" 
                                  style={{ 
                                    background: ticket.status === 'resolved' 
                                      ? 'rgba(16, 185, 129, 0.1)' 
                                      : ticket.status === 'answered' 
                                      ? 'rgba(139, 92, 246, 0.1)' 
                                      : 'rgba(245, 158, 11, 0.1)',
                                    border: ticket.status === 'resolved' 
                                      ? '1px solid rgba(16, 185, 129, 0.25)' 
                                      : ticket.status === 'answered' 
                                      ? '1px solid rgba(139, 92, 246, 0.25)' 
                                      : '1px solid rgba(245, 158, 11, 0.25)',
                                    color: ticket.status === 'resolved' 
                                      ? '#10b981' 
                                      : ticket.status === 'answered' 
                                      ? '#8b5cf6' 
                                      : '#f59e0b'
                                  }}
                                >
                                  {ticket.status === 'resolved' ? pt.statusResolved : ticket.status === 'answered' ? pt.statusAnswered : pt.statusOpen}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.75rem' }}>{new Date(ticket.created).toLocaleDateString()}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button onClick={() => setSelectedTicket(ticket)} className="admin-action-btn edit-btn" style={{ borderRadius: '8px', padding: '0.35rem 0.8rem' }}>
                                  {pt.openMsgs}
                                </button>
                              </td>
                            </tr>
                          ))}
                          {tickets.length === 0 && (
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-secondary)' }}>
                                {pt.emptyTickets}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Destek Bileti Detay Sohbet Arayüzü */}
              {activeTab === 'tickets' && selectedTicket && (
                <div className="portal-glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', minHeight: '540px', animation: 'tabFadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                    <div>
                      <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem', padding: 0 }}>
                        {pt.backToTickets}
                      </button>
                      <h3 className="font-display font-bold" style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>{selectedTicket.title}</h3>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{pt.categoryCol}: {selectedTicket.category}</span>
                    </div>

                    <div>
                      <span 
                        className="portal-badge" 
                        style={{ 
                          background: selectedTicket.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          border: selectedTicket.status === 'resolved' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                          color: selectedTicket.status === 'resolved' ? '#10b981' : '#f59e0b'
                        }}
                      >
                        {selectedTicket.status === 'resolved' ? pt.statusResolved : selectedTicket.status === 'answered' ? pt.statusAnswered : pt.statusOpen}
                      </span>
                    </div>
                  </div>

                  {/* Chat messages box */}
                  <div style={{ flex: 1, minHeight: '280px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(0,0,0,0.25)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    {selectedTicket.messages.map((msg, idx) => {
                      const isClient = msg.role === 'client'
                      return (
                        <div key={idx} style={{ alignSelf: isClient ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', alignSelf: isClient ? 'flex-end' : 'flex-start', marginBottom: '0.25rem', fontWeight: 600 }}>
                            {msg.sender} • {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div 
                            className={isClient ? 'portal-chat-bubble-client' : 'portal-chat-bubble-support'}
                            style={{
                              padding: '0.85rem 1.1rem',
                              borderRadius: '16px',
                              borderTopRightRadius: isClient ? '2px' : '16px',
                              borderTopLeftRadius: isClient ? '16px' : '2px',
                              fontSize: '0.8rem',
                              lineHeight: 1.45,
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Chat Input form */}
                  {selectedTicket.status === 'resolved' ? (
                    <div style={{ textAlign: 'center', padding: '1.25rem', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', background: 'rgba(16,185,129,0.03)', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {pt.resolvedAlert}
                    </div>
                  ) : (
                    <form onSubmit={handleReplyTicket} style={{ display: 'flex', gap: '0.85rem' }}>
                      <input
                        type="text"
                        className="portal-input-glow"
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        placeholder={pt.replyPlaceholder}
                        required
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.75rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                        {pt.sendReplyBtn}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: Profil & Hesap Detayları */}
              {activeTab === 'profile' && (
                <div className="portal-glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', animation: 'tabFadeIn 0.3s ease' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
                    <h3 className="font-display font-bold text-gradient" style={{ fontSize: '1.2rem', margin: 0 }}>{pt.profileTitle}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', margin: 0 }}>{pt.profileDesc}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '2rem' }}>
                    <div className="portal-avatar-wrapper" onClick={() => document.getElementById('portal-avatar-file-input').click()}>
                      {isUploadingAvatar && (
                        <div className="portal-avatar-spinner">
                          <div className="portal-avatar-spinner-ring"></div>
                        </div>
                      )}
                      {currentUser.profilePic ? (
                        <img src={currentUser.profilePic} alt="" className="portal-avatar-img" />
                      ) : (
                        <div className="portal-avatar-placeholder">
                          {currentUser.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="portal-avatar-overlay">
                        <span className="portal-avatar-overlay-icon">📷</span>
                        <span className="portal-avatar-overlay-text">{isUploadingAvatar ? pt.uploading : pt.changeAvatar}</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="portal-avatar-file-input"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                    />
                    <h4 className="font-display font-bold" style={{ fontSize: '1.15rem', margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>{currentUser.username}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{currentUser.email}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.25rem' }}>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>{pt.usernameProfile}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentUser.username}</span>
                    </div>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>{pt.emailProfile}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentUser.email}</span>
                    </div>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>{pt.purchasesCount}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentUser.purchases?.length || 0} {pt.purchasesCountVal}</span>
                    </div>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>{pt.accountType}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                        {currentUser.purchases?.length > 0 ? pt.premiumClient : pt.standardMember}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleLogout} className="admin-logout-btn" style={{ padding: '0.85rem 2.25rem', borderRadius: '12px' }}>
                      {pt.logoutProfileBtn}
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* MODAL: Ürün Güncellemeleri Modal Arayüzü */}
      {selectedProductUpdates && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
          <div className="portal-glow-card" style={{ width: '90%', maxWidth: '580px', background: 'var(--bg)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '2.5rem', borderRadius: '24px', position: 'relative', maxHeight: '85vh', overflowY: 'auto' }}>
            <button
              onClick={() => setSelectedProductUpdates(null)}
              className="admin-close-form-btn"
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
            >
              {pt.cancelBtn}
            </button>

            <h3 className="font-display font-bold text-gradient" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', letterSpacing: '0.05em' }}>
              {pt.updatesModalTitle}
            </h3>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '1.5rem', margin: 0 }}>
              {lang === 'en' && selectedProductUpdates.pack.name.en ? selectedProductUpdates.pack.name.en : selectedProductUpdates.pack.name.tr}
            </h4>

            {selectedProductUpdates.dl?.updates?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                {selectedProductUpdates.dl.updates.map((upd, idx) => (
                  <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', padding: '1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)' }}>{upd.title}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>🕒 {upd.date}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-line', lineHeight: 1.45 }}>{upd.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                {pt.noUpdatesYet}
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

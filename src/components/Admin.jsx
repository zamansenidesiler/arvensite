import { useState, useEffect } from 'react'
import { packages as initialPackages } from '../config/packages'
import { siteConfig as initialSiteConfig } from '../config/site'
import { galleryImages as initialGallery } from '../config/gallery'
import trTranslations from '../i18n/tr'
import enTranslations from '../i18n/en'

// Simple Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`admin-toast ${type}`}>
      <span>{message}</span>
    </div>
  )
}

// Tag / Chip Input Component
function TagInput({ label, tags = [], onChange, placeholder = "Metin yazıp Ekle tuşuna basın" }) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
      setInputValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className="admin-tag-container" style={{ marginBottom: '1.25rem' }}>
      <label className="admin-field-label">{label} ({tags.length})</label>
      <div className="admin-tag-chips-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem', minHeight: '32px', padding: '0.3rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(0,0,0,0.1)' }}>
        {tags.map((tag, idx) => (
          <span key={idx} className="admin-tag-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
            {tag}
            <button type="button" onClick={() => handleRemove(idx)} className="admin-tag-remove-btn" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', padding: '0 2px' }}>
              &times;
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '0.15rem 0.3rem' }}>Henüz eklenmemiş</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="admin-field-input"
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', flex: 1 }}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Ekle
        </button>
      </div>
    </div>
  )
}

// Helper to hash password on client side
async function hashPassword(input) {
  const msgBuffer = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_token') === 'fc7dcb7aadb20631a57fbe31c31a46273b4fb21ceab145997737c7b86c465c31'
  })
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'products' | 'sections' | 'branding' | 'gallery' | 'admin_tickets' | 'admin_users' | 'admin_downloads'

  // Data states
  const [packagesList, setPackagesList] = useState(initialPackages)
  const [trData, setTrData] = useState(trTranslations)
  const [enData, setEnData] = useState(enTranslations)
  const [siteConfigData, setSiteConfigData] = useState(initialSiteConfig)
  const [galleryList, setGalleryList] = useState(initialGallery)

  // Portal / Customer Panel admin state
  const [portalUsers, setPortalUsers] = useState([])
  const [portalTickets, setPortalTickets] = useState([])
  const [portalDownloads, setPortalDownloads] = useState({})
  
  const [selectedPortalTicket, setSelectedPortalTicket] = useState(null)
  const [adminReplyText, setAdminReplyText] = useState('')
  
  const [editingUserPurchases, setEditingUserPurchases] = useState(null)
  const [editingUserPurchasesList, setEditingUserPurchasesList] = useState([])
  
  const [editingDownloadPackageId, setEditingDownloadPackageId] = useState(null)
  const [editingDownloadUrl, setEditingDownloadUrl] = useState('')
  const [editingDownloadUpdates, setEditingDownloadUpdates] = useState([])
  
  const [newUpdateTitle, setNewUpdateTitle] = useState('')
  const [newUpdateContent, setNewUpdateContent] = useState('')
  const [newUpdateDate, setNewUpdateDate] = useState('')

  // User CRUD states
  const [editingUser, setEditingUser] = useState(null)
  const [editUserUsername, setEditUserUsername] = useState('')
  const [editUserEmail, setEditUserEmail] = useState('')
  const [editUserPassword, setEditUserPassword] = useState('')

  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [createUserUsername, setCreateUserUsername] = useState('')
  const [createUserEmail, setCreateUserEmail] = useState('')
  const [createUserPassword, setCreateUserPassword] = useState('')

  // Accordion state for translation sections
  const [activeAccordionGroup, setActiveAccordionGroup] = useState('intro')

  // Cache-busting state for logos
  const [logoDarkVersion, setLogoDarkVersion] = useState(Date.now())
  const [logoLightVersion, setLogoLightVersion] = useState(Date.now())

  // Product Editing states
  const [editingProduct, setEditingProduct] = useState(null) // null | product object
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)

  // Translation Editing states
  const [selectedSection, setSelectedSection] = useState('nav') // default 'nav'

  // Toast notification state
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Helper to render simple text/textarea input fields side-by-side for TR/EN translations
  const renderSimpleFields = (sectionName, fieldsArray) => {
    return (
      <div className="admin-split-editor" style={{ marginBottom: '1.5rem', gap: '1.5rem' }}>
        <div className="split-pane">
          <div className="split-pane-header">TURKISH TEXTS</div>
          {fieldsArray.map(f => (
            <div style={{ marginBottom: '1.25rem' }} key={f.key}>
              <label className="admin-field-label">{f.label} (TR)</label>
              {f.type === 'textarea' ? (
                <textarea
                  rows="3"
                  className="admin-field-textarea"
                  value={trData[sectionName]?.[f.key] || ''}
                  onChange={e => handleTextChange('tr', sectionName, f.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="admin-field-input"
                  value={trData[sectionName]?.[f.key] || ''}
                  onChange={e => handleTextChange('tr', sectionName, f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="split-pane">
          <div className="split-pane-header">ENGLISH TEXTS</div>
          {fieldsArray.map(f => (
            <div style={{ marginBottom: '1.25rem' }} key={f.key}>
              <label className="admin-field-label">{f.label} (EN)</label>
              {f.type === 'textarea' ? (
                <textarea
                  rows="3"
                  className="admin-field-textarea"
                  value={enData[sectionName]?.[f.key] || ''}
                  onChange={e => handleTextChange('en', sectionName, f.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="admin-field-input"
                  value={enData[sectionName]?.[f.key] || ''}
                  onChange={e => handleTextChange('en', sectionName, f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const hashed = await hashPassword(password)
      if (hashed === 'fc7dcb7aadb20631a57fbe31c31a46273b4fb21ceab145997737c7b86c465c31') {
        sessionStorage.setItem('admin_token', hashed)
        setIsLoggedIn(true)
        showToast('Giriş başarılı!', 'success')
      } else {
        setLoginError('Hatalı şifre!')
      }
    } catch (err) {
      setLoginError('Sistem hatası!')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setIsLoggedIn(false)
    setPassword('')
  }

  // --- PORTAL ADMIN HANDLERS ---
  const loadPortalData = async () => {
    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/admin/get-portal-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        }
      })
      const result = await res.json()
      if (result.success) {
        setPortalUsers(result.users)
        setPortalTickets(result.tickets)
        setPortalDownloads(result.downloads)
        
        // If a ticket is currently selected, refresh it
        if (selectedPortalTicket) {
          const freshTicket = result.tickets.find(t => t.id === selectedPortalTicket.id)
          if (freshTicket) setSelectedPortalTicket(freshTicket)
        }
      }
    } catch (err) {
      console.error('Portal verileri yüklenirken hata oluştu:', err)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadPortalData()
      
      // Auto-poll tickets every 10 seconds for replies when logged in as admin
      const timer = setInterval(() => {
        loadPortalData()
      }, 10000)
      return () => clearInterval(timer)
    }
  }, [isLoggedIn, selectedPortalTicket?.id])

  const handleAdminReplyTicket = async (e) => {
    e.preventDefault()
    if (!adminReplyText.trim() || !selectedPortalTicket) return

    try {
      const res = await fetch('/api/portal/reply-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedPortalTicket.id,
          sender: 'Admin',
          role: 'support',
          text: adminReplyText.trim()
        })
      })

      const result = await res.json()
      if (result.success) {
        setAdminReplyText('')
        setSelectedPortalTicket(result.ticket)
        showToast('Destek talebi cevaplandı!', 'success')
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Cevap gönderilemedi!', 'error')
    }
  }

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch('/api/portal/reply-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          sender: 'Sistem',
          role: 'support',
          text: `[Sistem] Talep durumu '${newStatus === 'resolved' ? 'Çözüldü' : 'Açık'}' olarak güncellendi.`,
          status: newStatus
        })
      })

      const result = await res.json()
      if (result.success) {
        if (selectedPortalTicket && selectedPortalTicket.id === ticketId) {
          setSelectedPortalTicket(result.ticket)
        }
        showToast('Talep durumu güncellendi!', 'success')
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Durum güncellenemedi!', 'error')
    }
  }

  const handleSaveUserPurchases = async (e) => {
    e.preventDefault()
    if (!editingUserPurchases) return

    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/admin/update-user-purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({
          email: editingUserPurchases.email,
          purchases: editingUserPurchasesList
        })
      })

      const result = await res.json()
      if (result.success) {
        showToast('Kullanıcı satın alımları başarıyla güncellendi!', 'success')
        setEditingUserPurchases(null)
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Kullanıcı güncellenemedi!', 'error')
    }
  }
  const handleSaveUserDetails = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const token = sessionStorage.getItem('admin_token') || ''
      let passwordHash = null
      if (editUserPassword.trim()) {
        passwordHash = await hashPassword(editUserPassword.trim())
      }

      const res = await fetch('/api/admin/save-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({
          email: editingUser.email,
          username: editUserUsername.trim(),
          newEmail: editUserEmail.trim().toLowerCase(),
          passwordHash
        })
      })

      const result = await res.json()
      if (result.success) {
        showToast('Kullanıcı bilgileri başarıyla güncellendi!', 'success')
        setEditingUser(null)
        setEditUserPassword('')
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Kullanıcı güncellenemedi!', 'error')
    }
  }

  const handleDeleteUser = async (email) => {
    if (!window.confirm('Bu kullanıcıyı tamamen silmek istediğinize emin misiniz?')) return

    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ email })
      })

      const result = await res.json()
      if (result.success) {
        showToast('Kullanıcı başarıyla silindi!', 'success')
        if (editingUser && editingUser.email === email) {
          setEditingUser(null)
        }
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Kullanıcı silinemedi!', 'error')
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!createUserUsername.trim() || !createUserEmail.trim() || !createUserPassword.trim()) {
      showToast('Lütfen tüm alanları doldurun!', 'error')
      return
    }

    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const passwordHash = await hashPassword(createUserPassword.trim())
      
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({
          username: createUserUsername.trim(),
          email: createUserEmail.trim().toLowerCase(),
          passwordHash
        })
      })

      const result = await res.json()
      if (result.success) {
        showToast('Yeni kullanıcı hesabı oluşturuldu!', 'success')
        setIsCreatingUser(false)
        setCreateUserUsername('')
        setCreateUserEmail('')
        setCreateUserPassword('')
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Kullanıcı oluşturulamadı!', 'error')
    }
  }
  const handleToggleUserBan = async (email) => {
    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/admin/toggle-user-ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ email })
      })

      const result = await res.json()
      if (result.success) {
        showToast(result.isBanned ? 'Kullanıcı hesabı yasaklandı!' : 'Kullanıcı hesabının yasağı kaldırıldı!', 'success')
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('Yasaklama işlemi başarısız!', 'error')
    }
  }

  const handleSaveDownloads = async (e) => {
    e.preventDefault()
    if (!editingDownloadPackageId) return

    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const updatedDownloads = {
        ...portalDownloads,
        [editingDownloadPackageId]: {
          downloadUrl: editingDownloadUrl.trim(),
          updates: editingDownloadUpdates
        }
      }

      const res = await fetch('/api/admin/save-downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ downloads: updatedDownloads })
      })

      const result = await res.json()
      if (result.success) {
        showToast('İndirme ayarları başarıyla kaydedildi!', 'success')
        setEditingDownloadPackageId(null)
        loadPortalData()
      } else {
        showToast(result.error, 'error')
      }
    } catch (err) {
      showToast('İndirme ayarları kaydedilemedi!', 'error')
    }
  }

  const handleAddUpdateLog = (e) => {
    e.preventDefault()
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) {
      showToast('Lütfen güncelleme başlığı ve içeriği girin!', 'error')
      return
    }

    const newLog = {
      title: newUpdateTitle.trim(),
      content: newUpdateContent.trim(),
      date: newUpdateDate || new Date().toLocaleDateString('tr-TR')
    }

    setEditingDownloadUpdates([newLog, ...editingDownloadUpdates])
    setNewUpdateTitle('')
    setNewUpdateContent('')
    setNewUpdateDate('')
    showToast('Güncelleme logu eklendi!', 'info')
  }

  const handleRemoveUpdateLog = (idxToRemove) => {
    setEditingDownloadUpdates(editingDownloadUpdates.filter((_, idx) => idx !== idxToRemove))
    showToast('Güncelleme logu silindi.', 'info')
  }

  // --- SAVE ACTIONS (Fetch local API) ---
  const savePackages = async (updatedList) => {
    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/save-packages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ packages: updatedList }),
      })
      const result = await res.json()
      if (result.success) {
        showToast('Ürünler başarıyla kaydedildi!', 'success')
      } else {
        showToast('Kayıt sırasında hata oluştu: ' + result.error, 'error')
      }
    } catch (err) {
      showToast('Sunucu bağlantı hatası!', 'error')
    }
  }

  const saveTranslations = async (lang, updatedTranslations) => {
    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/save-translations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ lang, translations: updatedTranslations }),
      })
      const result = await res.json()
      if (result.success) {
        showToast(`${lang.toUpperCase()} çevirileri başarıyla güncellendi!`, 'success')
      } else {
        showToast('Çeviri hatası: ' + result.error, 'error')
      }
    } catch (err) {
      showToast('Sunucu bağlantı hatası!', 'error')
    }
  }

  const saveSiteConfig = async (updatedConfig) => {
    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/save-site-config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ siteConfig: updatedConfig }),
      })
      const result = await res.json()
      if (result.success) {
        setSiteConfigData(updatedConfig)
        showToast('Site ayarları başarıyla diske kaydedildi!', 'success')
      } else {
        showToast('Kayıt sırasında hata oluştu: ' + result.error, 'error')
      }
    } catch (err) {
      showToast('Sunucu bağlantı hatası!', 'error')
    }
  }

  const saveGallery = async (updatedList) => {
    try {
      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/save-gallery', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({ galleryImages: updatedList }),
      })
      const result = await res.json()
      if (result.success) {
        setGalleryList(updatedList)
        showToast('Galeri başarıyla diske kaydedildi!', 'success')
      } else {
        showToast('Kayıt sırasında hata oluştu: ' + result.error, 'error')
      }
    } catch (err) {
      showToast('Sunucu bağlantı hatası!', 'error')
    }
  }

  const handleLogoUpload = async (file, theme) => {
    try {
      showToast('Logo sunucuya yükleniyor...', 'info')
      const fileUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const token = sessionStorage.getItem('admin_token') || ''
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify({
          filename: file.name,
          fileData: fileUrl,
          isLogo: true,
          logoTheme: theme
        })
      })

      const result = await res.json()
      if (result.success) {
        showToast(`${theme === 'light' ? 'Açık' : 'Koyu'} tema logosu başarıyla güncellendi!`, 'success')
        if (theme === 'light') {
          setLogoLightVersion(Date.now())
        } else {
          setLogoDarkVersion(Date.now())
        }
      } else {
        showToast('Logo yüklenirken hata oluştu: ' + result.error, 'error')
      }
    } catch (err) {
      showToast('Dosya okuma veya yükleme hatası!', 'error')
    }
  }

  // --- GENERAL TRANSLATIONS CHANGERS ---
  const handleTextChange = (lang, section, key, value, index = null, subKey = null) => {
    const isTr = lang === 'tr';
    const data = isTr ? trData : enData;
    const setData = isTr ? setTrData : setEnData;
    
    // Deep clone
    const newData = JSON.parse(JSON.stringify(data));
    
    if (key === null) {
      // Root key direct replacement (e.g. marquee)
      newData[section] = value;
    } else if (index !== null) {
      // Nested array
      if (subKey !== null) {
        newData[section][key][index][subKey] = value;
      } else {
        newData[section][key][index] = value;
      }
    } else if (subKey !== null) {
      // Nested object key
      newData[section][key][subKey] = value;
    } else {
      // Simple section key
      newData[section][key] = value;
    }
    
    setData(newData);
  }

  const handleSharedChange = (section, key, value, index = null, subKey = null) => {
    handleTextChange('tr', section, key, value, index, subKey);
    handleTextChange('en', section, key, value, index, subKey);
  }

  const addItem = (section, key, defaultTr, defaultEn) => {
    const newTr = JSON.parse(JSON.stringify(trData));
    const newEn = JSON.parse(JSON.stringify(enData));
    
    newTr[section][key].push(defaultTr);
    newEn[section][key].push(defaultEn);
    
    setTrData(newTr);
    setEnData(newEn);
    showToast('Yeni öğe eklendi (Diske kaydetmeyi unutmayın!)', 'success');
  };

  const removeItem = (section, key, index) => {
    if (!window.confirm('Bu öğeyi silmek istediğinize emin misiniz?')) return;
    const newTr = JSON.parse(JSON.stringify(trData));
    const newEn = JSON.parse(JSON.stringify(enData));
    
    newTr[section][key].splice(index, 1);
    newEn[section][key].splice(index, 1);
    
    setTrData(newTr);
    setEnData(newEn);
    showToast('Öğe silindi (Diske kaydetmeyi unutmayın!)', 'info');
  };

  // --- PRODUCT CRUD ---
  const handleProductDelete = (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    const newList = packagesList.filter(p => p.id !== id)
    setPackagesList(newList)
    savePackages(newList)
  }

  const handleProductEditSelect = (product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)))
    setIsCreatingProduct(false)
  }

  const handleProductCreateSelect = () => {
    setEditingProduct({
      id: String(Date.now()),
      name: { tr: '', en: '' },
      price: '$19.99',
      tebexUrl: '',
      youtubeUrl: '',
      images: [],
      badges: { tr: [], en: [] },
      description: { tr: '', en: '' },
      specs: { fileSize: '10 MB', platform: 'GTA V / FiveM', license: 'Tebex Escrow', format: 'Add-on resource' },
      features: { tr: [], en: [] },
      installation: { tr: [], en: [] },
    })
    setIsCreatingProduct(true)
  }

  const handleProductFormSubmit = (e) => {
    e.preventDefault()

    const processedProduct = {
      ...editingProduct,
      images: editingProduct.images || []
    }

    let newList
    if (isCreatingProduct) {
      if (packagesList.some(p => p.id === processedProduct.id)) {
        showToast('Bu ID zaten mevcut! Lütfen benzersiz bir ID girin.', 'error')
        return
      }
      newList = [...packagesList, processedProduct]
    } else {
      newList = packagesList.map(p => p.id === processedProduct.id ? processedProduct : p)
    }

    setPackagesList(newList)
    savePackages(newList)
    setEditingProduct(null)
    setIsCreatingProduct(false)
  }

  const handleSectionSave = (e) => {
    e.preventDefault()
    saveTranslations('tr', trData)
    saveTranslations('en', enData)
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-card card-glow-orange" onSubmit={handleLogin}>
          <div className="admin-login-logo">AM</div>
          <h2 className="font-display font-bold text-gradient" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            {siteConfigData.brandName.toUpperCase()} CMS LOGIN
          </h2>
          <div style={{ marginBottom: '1.5rem', width: '100%' }}>
            <label className="admin-field-label">ADMİN ŞİFRESİ</label>
            <input
              type="password"
              className="admin-field-input"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError('') }}
              placeholder="••••••••"
              required
              autoFocus
            />
            {loginError && <p className="admin-login-error">{loginError}</p>}
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Giriş Yap
          </button>
          <a href="#" className="admin-back-site-btn">Siteye Geri Dön</a>
        </form>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    )
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar Panel */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">AM</div>
          <div>
            <div className="font-display font-extrabold" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
              {siteConfigData.brandName.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em' }}>
              ADMİN CMS
            </div>
          </div>
        </div>

        <nav className="admin-sidebar-menu">
          <button
            onClick={() => { setActiveTab('dashboard'); setEditingProduct(null) }}
            className={`admin-menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            📊 Genel Bakış
          </button>
          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null) }}
            className={`admin-menu-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            📦 Ürün Yönetimi
          </button>
          <button
            onClick={() => { setActiveTab('gallery'); setEditingProduct(null) }}
            className={`admin-menu-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          >
            🖼️ Galeri Yönetimi
          </button>
          <button
            onClick={() => { setActiveTab('sections'); setEditingProduct(null) }}
            className={`admin-menu-btn ${activeTab === 'sections' ? 'active' : ''}`}
          >
            📝 Sayfa İçerikleri
          </button>
          <button
            onClick={() => { setActiveTab('branding'); setEditingProduct(null) }}
            className={`admin-menu-btn ${activeTab === 'branding' ? 'active' : ''}`}
          >
            🎨 Marka & Ayarlar
          </button>
          
          <div style={{ margin: '1rem 0 0.5rem', height: '1px', background: 'var(--border)' }}></div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, paddingLeft: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MÜŞTERİ PORTALI</div>
          
          <button
            onClick={() => { setActiveTab('admin_tickets'); setEditingProduct(null); setSelectedPortalTicket(null) }}
            className={`admin-menu-btn ${activeTab === 'admin_tickets' ? 'active' : ''}`}
          >
            💬 Destek Talepleri
          </button>
          <button
            onClick={() => { setActiveTab('admin_users'); setEditingProduct(null); setEditingUserPurchases(null) }}
            className={`admin-menu-btn ${activeTab === 'admin_users' ? 'active' : ''}`}
          >
            👥 Kullanıcı Yönetimi
          </button>
          <button
            onClick={() => { setActiveTab('admin_downloads'); setEditingProduct(null); setEditingDownloadPackageId(null) }}
            className={`admin-menu-btn ${activeTab === 'admin_downloads' ? 'active' : ''}`}
          >
            💾 İndirme & Sürümler
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            🚪 Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="admin-workspace">
        <header className="admin-workspace-header">
          <div className="admin-workspace-title">
            <h2 className="font-display font-bold">
              {activeTab === 'dashboard' ? 'Genel Bakış' : activeTab === 'products' ? 'Ürün Yönetimi' : activeTab === 'sections' ? 'Tüm Site İçerikleri' : activeTab === 'branding' ? 'Marka & Site Ayarları' : activeTab === 'gallery' ? 'Galeri Yönetimi' : activeTab === 'admin_tickets' ? 'Destek Talepleri' : activeTab === 'admin_users' ? 'Kullanıcı Yönetimi' : 'İndirme & Sürüm Ayarları'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {activeTab === 'dashboard'
                ? 'Sitenizin genel durumu, sayaçları, logoları ve hızlı bağlantıları.'
                : activeTab === 'products'
                ? 'Paketlerinizi düzenleyin, silin veya Tebex mağazanıza yeni bir kıyafet paketi ekleyin.'
                : activeTab === 'sections'
                ? 'Sitenin tamamındaki tüm menüleri, başlıkları, listeleri, yorumları ve fiyatları düzenleyin.'
                : activeTab === 'branding'
                ? 'Site logolarını güncelleyin ve temel ayarları (Discord linki, slogan vb.) yönetin.'
                : activeTab === 'gallery'
                ? 'Bento asimetrik galeri görsellerini ekleyin, silin ve boyutlarını ayarlayın.'
                : activeTab === 'admin_tickets'
                ? 'Müşterilerden gelen destek taleplerini okuyun, bilet durumunu güncelleyin ve yanıt yazın.'
                : activeTab === 'admin_users'
                ? 'Kayıtlı kullanıcı hesaplarını listeyin ve satın aldıkları ürün yetkilerini el ile tanımlayın.'
                : 'Paketlerin indirme bağlantılarını MEGA/Drive olarak tanımlayın ve sürüm güncelleme (changelog) geçmişini ekleyin.'}
            </p>
          </div>
          <a href="#" className="btn-outlined-modern" style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
            Siteyi Önizle
          </a>
        </header>

        <div className="admin-workspace-body">
          {/* Tab 0: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div style={{ animation: 'tabFadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* KPI Statistics Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stats-card">
                  <div className="admin-stats-icon">📦</div>
                  <div className="admin-stats-info">
                    <span className="admin-stats-label">TOPLAM ÜRÜN</span>
                    <h3 className="admin-stats-value">{packagesList.length}</h3>
                  </div>
                </div>

                <div className="admin-stats-card">
                  <div className="admin-stats-icon">💬</div>
                  <div className="admin-stats-info">
                    <span className="admin-stats-label">AKTİF DİL</span>
                    <h3 className="admin-stats-value">2 (TR / EN)</h3>
                  </div>
                </div>

                <div className="admin-stats-card">
                  <div className="admin-stats-icon">⚙️</div>
                  <div className="admin-stats-info">
                    <span className="admin-stats-label">SUNUCULAR</span>
                    <h3 className="admin-stats-value">{siteConfigData.stats.servers}</h3>
                  </div>
                </div>

                <div className="admin-stats-card">
                  <div className="admin-stats-icon">✨</div>
                  <div className="admin-stats-info">
                    <span className="admin-stats-label">TASARIMLAR</span>
                    <h3 className="admin-stats-value">{siteConfigData.stats.designs}</h3>
                  </div>
                </div>
              </div>

              {/* System & Brand Overview */}
              <div className="admin-form-grid">
                <div className="admin-panel-card card-glow-orange" style={{ background: 'var(--surface)' }}>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    ✨ Marka & Site Özeti
                  </h3>
                  <div className="admin-overview-list">
                    <div className="admin-overview-item">
                      <strong>Marka Adı:</strong> <span>{siteConfigData.brandName}</span>
                    </div>
                    <div className="admin-overview-item">
                      <strong>Slogan:</strong> <span>{siteConfigData.tagline}</span>
                    </div>
                    <div className="admin-overview-item">
                      <strong>Domain:</strong> <a href={siteConfigData.domain} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{siteConfigData.domain}</a>
                    </div>
                    <div className="admin-overview-item">
                      <strong>Discord URL:</strong> <a href={siteConfigData.discord} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{siteConfigData.discord}</a>
                    </div>
                    <div className="admin-overview-item">
                      <strong>Tanıtım Video ID:</strong> <span style={{ fontFamily: 'monospace' }}>{siteConfigData.videoId}</span>
                    </div>
                  </div>
                </div>

                <div className="admin-panel-card card-glow-orange" style={{ background: 'var(--surface)' }}>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    🎨 Aktif Marka Logoları
                  </h3>
                  <div style={{ display: 'flex', gap: '2rem', height: '100%', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div className="admin-logo-preview-box dark-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: '#0a0a0f', width: '160px', height: '80px' }}>
                        <img src={`/logo.webp?t=${logoDarkVersion}`} alt="Dark Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <span className="admin-field-label" style={{ marginTop: '0.5rem', display: 'block' }}>Koyu Tema Logosu</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div className="admin-logo-preview-box light-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: '#f5f5f5', width: '160px', height: '80px' }}>
                        <img src={`/logo-light.webp?t=${logoLightVersion}`} alt="Light Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <span className="admin-field-label" style={{ marginTop: '0.5rem', display: 'block' }}>Açık Tema Logosu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="admin-panel-card card-glow-orange" style={{ background: 'var(--surface)' }}>
                <h3 className="font-display font-bold" style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  🚀 Hızlı İşlemler
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveTab('products')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
                    📦 Ürünleri Yönet
                  </button>
                  <button onClick={() => setActiveTab('gallery')} className="btn-ghost" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
                    🖼️ Bento Galeri Yönet
                  </button>
                  <button onClick={() => setActiveTab('sections')} className="btn-ghost" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
                    📝 İçerikleri Düzenle
                  </button>
                  <button onClick={() => setActiveTab('branding')} className="btn-ghost" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
                    🎨 Marka & Logo Değiştir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Bento Gallery Settings */}
          {activeTab === 'gallery' && (
            <div style={{ animation: 'tabFadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="admin-panel-card card-glow-orange" style={{ background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem' }}>Bento Galeri Görselleri ({galleryList.length})</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Değişikliklerin kaydedilmesi için diske yazılması gerekir.</span>
                </div>

                {/* Gallery Items Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {galleryList.map((item, idx) => (
                    <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Boyut:</span>
                        <select
                          className="admin-field-input"
                          style={{ width: '120px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          value={item.span}
                          onChange={e => {
                            const updated = galleryList.map(g => g.id === item.id ? { ...g, span: e.target.value } : g);
                            setGalleryList(updated);
                          }}
                        >
                          <option value="narrow">Dar (1x)</option>
                          <option value="wide">Geniş (2x)</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Bu galeri görselini silmek istediğinize emin misiniz?')) {
                            const updated = galleryList.filter(g => g.id !== item.id);
                            setGalleryList(updated);
                          }
                        }}
                        className="admin-action-btn delete-btn"
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        Görseli Sil
                      </button>
                    </div>
                  ))}

                  {/* Add New Gallery Image Card */}
                  <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', minHeight: '240px', position: 'relative' }}>
                    <span style={{ fontSize: '2rem' }}>📁</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Yeni Galeri Görseli Seçin / Sürükleyin</span>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        try {
                          showToast('Görsel sunucuya yükleniyor...', 'info');
                          const fileUrl = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                          });
                          
                          const token = sessionStorage.getItem('admin_token') || '';
                          const uploadRes = await fetch('/api/upload-image', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-Admin-Token': token
                            },
                            body: JSON.stringify({ filename: file.name, fileData: fileUrl })
                          });
                          
                          const uploadResult = await uploadRes.json();
                          if (uploadResult.success) {
                            const newImage = {
                              id: Date.now(),
                              src: uploadResult.url,
                              span: 'narrow'
                            };
                            setGalleryList([...galleryList, newImage]);
                            showToast('Yeni bento görseli eklendi!', 'success');
                          } else {
                            showToast(`Yükleme hatası: ${uploadResult.error}`, 'error');
                          }
                        } catch (err) {
                          showToast('Dosya okuma hatası!', 'error');
                        }
                      }}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => saveGallery(galleryList)}
                    className="btn-primary"
                    style={{ padding: '0.875rem 2.5rem' }}
                  >
                    Galeri Değişikliklerini Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Branding & Logo Settings */}
          {activeTab === 'branding' && (
            <div style={{ animation: 'tabFadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Logo Management Row */}
              <div className="admin-panel-card card-glow-orange" style={{ background: 'var(--surface)' }}>
                <h3 className="font-display font-bold" style={{ fontSize: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  🖼️ Site Logolarını Güncelle
                </h3>
                
                <div className="admin-form-grid">
                  {/* Dark Theme Logo (logo.webp) */}
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                    <h4 className="admin-field-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      KOYU TEMA LOGOSU (Dark Theme Logo - /logo.webp)
                    </h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div className="admin-logo-preview-box dark-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: '#0a0a0f', width: '160px', height: '80px' }}>
                        <img src={`/logo.webp?t=${logoDarkVersion}`} alt="Dark Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mevcut Koyu Logo Önizlemesi</span>
                      </div>
                    </div>

                    <div style={{
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      padding: '1rem',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onDragOver={e => e.preventDefault()}
                    >
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        📁 Yeni Koyu Logo Seçin (.webp)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files[0]
                          if (file) handleLogoUpload(file, 'dark')
                        }}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  {/* Light Theme Logo (logo-light.webp) */}
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                    <h4 className="admin-field-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      AÇIK TEMA LOGOSU (Light Theme Logo - /logo-light.webp)
                    </h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div className="admin-logo-preview-box light-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: '#f5f5f5', width: '160px', height: '80px' }}>
                        <img src={`/logo-light.webp?t=${logoLightVersion}`} alt="Light Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mevcut Açık Logo Önizlemesi</span>
                      </div>
                    </div>

                    <div style={{
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      padding: '1rem',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onDragOver={e => e.preventDefault()}
                    >
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        📁 Yeni Açık Logo Seçin (.webp)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files[0]
                          if (file) handleLogoUpload(file, 'light')
                        }}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* General Site Config Form */}
              <form
                onSubmit={e => {
                  e.preventDefault()
                  saveSiteConfig(siteConfigData)
                }}
                className="admin-panel-card card-glow-orange"
                style={{ background: 'var(--surface)' }}
              >
                <h3 className="font-display font-bold" style={{ fontSize: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  ⚙️ Genel Site Ayarları & Metrikleri
                </h3>

                <div className="admin-form-grid">
                  <div className="admin-form-column">
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="admin-field-label">Marka Adı (Brand Name)</label>
                      <input
                        type="text"
                        className="admin-field-input"
                        value={siteConfigData.brandName}
                        onChange={e => setSiteConfigData({ ...siteConfigData, brandName: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="admin-field-label">Site Sloganı (Tagline)</label>
                      <input
                        type="text"
                        className="admin-field-input"
                        value={siteConfigData.tagline}
                        onChange={e => setSiteConfigData({ ...siteConfigData, tagline: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="admin-field-label">Domain Adresi (Domain URL)</label>
                      <input
                        type="url"
                        className="admin-field-input"
                        value={siteConfigData.domain}
                        onChange={e => setSiteConfigData({ ...siteConfigData, domain: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-column">
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="admin-field-label">Discord Sunucu Bağlantısı (URL)</label>
                      <input
                        type="url"
                        className="admin-field-input"
                        value={siteConfigData.discord}
                        onChange={e => setSiteConfigData({ ...siteConfigData, discord: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="admin-field-label">Hakkımda Tanıtım Videosu (YouTube Video ID)</label>
                      <input
                        type="text"
                        className="admin-field-input"
                        value={siteConfigData.videoId}
                        onChange={e => setSiteConfigData({ ...siteConfigData, videoId: e.target.value })}
                        required
                      />
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                        YouTube linkinin sonundaki benzersiz video kodunu girin (Örn: watch?v=eP9C2tWf128 için eP9C2tWf128).
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistics Numbers */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--border)', paddingTop: '1.5rem' }}>
                  <h4 className="admin-field-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    📊 İstatistik Sayaç Sayıları (Hakkımda Bölümü)
                  </h4>
                  
                  <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div>
                      <label className="admin-field-label">Tasarım Sayısı (Designs)</label>
                      <input
                        type="number"
                        className="admin-field-input"
                        value={siteConfigData.stats.designs}
                        onChange={e => setSiteConfigData({
                          ...siteConfigData,
                          stats: { ...siteConfigData.stats, designs: Number(e.target.value) }
                        })}
                        required
                      />
                    </div>

                    <div>
                      <label className="admin-field-label">Çalışılan Sunucular (Servers)</label>
                      <input
                        type="number"
                        className="admin-field-input"
                        value={siteConfigData.stats.servers}
                        onChange={e => setSiteConfigData({
                          ...siteConfigData,
                          stats: { ...siteConfigData.stats, servers: Number(e.target.value) }
                        })}
                        required
                      />
                    </div>

                    <div>
                      <label className="admin-field-label">Deneyim Yılı (Years)</label>
                      <input
                        type="number"
                        className="admin-field-input"
                        value={siteConfigData.stats.years}
                        onChange={e => setSiteConfigData({
                          ...siteConfigData,
                          stats: { ...siteConfigData.stats, years: Number(e.target.value) }
                        })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
                    Site Ayarlarını Diske Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 1: Products Editor */}
          {activeTab === 'products' && !editingProduct && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="font-display font-bold" style={{ fontSize: '1rem' }}>Ürün Listesi ({packagesList.length})</h3>
                <button onClick={handleProductCreateSelect} className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8rem' }}>
                  + Yeni Ürün Ekle
                </button>
              </div>

              <div className="admin-table-scroll-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ürün ID</th>
                      <th>Görsel</th>
                      <th>Ürün Adı (TR)</th>
                      <th>Fiyat</th>
                      <th style={{ textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagesList.map(pack => (
                      <tr key={pack.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)' }}>{pack.id}</td>
                        <td>
                          <img src={pack.images[0]} alt="" className="admin-table-thumb" />
                        </td>
                        <td style={{ fontWeight: 600 }}>{pack.name.tr}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{pack.price}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleProductEditSelect(pack)} className="admin-action-btn edit-btn">
                              Düzenle
                            </button>
                            <button onClick={() => handleProductDelete(pack.id)} className="admin-action-btn delete-btn">
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {packagesList.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                          Henüz hiçbir ürün eklenmemiş. Yeni ürün eklemek için sağ üstteki butona tıklayın!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Form Editor */}
          {activeTab === 'products' && editingProduct && (
            <form onSubmit={handleProductFormSubmit} className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h3 className="font-display font-bold" style={{ fontSize: '1rem' }}>
                  {isCreatingProduct ? 'Yeni Ürün Oluştur' : `Ürünü Düzenle: ${editingProduct.name.tr || editingProduct.id}`}
                </h3>
                <button type="button" onClick={() => setEditingProduct(null)} className="admin-close-form-btn">
                  İptal Et
                </button>
              </div>

              <div className="admin-form-grid">
                {/* Basic Details */}
                <div className="admin-form-column">
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">ÜRÜN ID (Benzersiz Sayı)</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.id}
                      onChange={e => setEditingProduct({ ...editingProduct, id: e.target.value })}
                      disabled={!isCreatingProduct}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">TEBEX SATIN ALMA LİNKİ (URL)</label>
                    <input
                      type="url"
                      className="admin-field-input"
                      value={editingProduct.tebexUrl}
                      onChange={e => setEditingProduct({ ...editingProduct, tebexUrl: e.target.value })}
                      placeholder="https://atiysu.tebex.io/package/..."
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">YOUTUBE VİDEO LİNKİ (İsteğe Bağlı - Görsel yerine gösterilir)</label>
                    <input
                      type="url"
                      className="admin-field-input"
                      value={editingProduct.youtubeUrl}
                      onChange={e => setEditingProduct({ ...editingProduct, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">ÜRÜN GÖRSELLERİ (Görsel Seç / Sürükle Bırak)</label>
                    
                    {/* Render current images as thumbnails with delete overlay */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {(editingProduct.images || []).map((imgUrl, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '80px', height: '54px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = [...(editingProduct.images || [])];
                              imgs.splice(idx, 1);
                              setEditingProduct({ ...editingProduct, images: imgs });
                              showToast('Görsel listeden kaldırıldı.', 'info');
                            }}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '18px',
                              height: '18px',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              lineHeight: 1,
                              padding: 0
                            }}
                            title="Görseli kaldır"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Drag-and-drop / click file selector upload field */}
                    <div style={{
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      position: 'relative',
                      marginBottom: '1rem',
                      transition: 'border-color 0.3s'
                    }}
                    onDragOver={e => e.preventDefault()}
                    >
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        📁 Görsel Dosyaları Seçin veya Buraya Sürükleyin
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          
                          showToast(`${files.length} görsel sunucuya yükleniyor...`, 'info');
                          const uploadedUrls = [];
                          
                          for (const file of files) {
                            try {
                              const fileUrl = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result);
                                reader.onerror = reject;
                                reader.readAsDataURL(file);
                              });
                              
                              const token = sessionStorage.getItem('admin_token') || '';
                              const uploadRes = await fetch('/api/upload-image', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'X-Admin-Token': token
                                },
                                body: JSON.stringify({ filename: file.name, fileData: fileUrl })
                              });
                              
                              const uploadResult = await uploadRes.json();
                              if (uploadResult.success) {
                                uploadedUrls.push(uploadResult.url);
                              } else {
                                showToast(`Yükleme hatası: ${uploadResult.error}`, 'error');
                              }
                            } catch (err) {
                              showToast(`Dosya okuma hatası: ${file.name}`, 'error');
                            }
                          }
                          
                          if (uploadedUrls.length > 0) {
                            const currentImgs = editingProduct.images || [];
                            const updatedImgs = [...currentImgs, ...uploadedUrls];
                            setEditingProduct({ ...editingProduct, images: updatedImgs });
                            showToast(`${uploadedUrls.length} yeni görsel başarıyla yüklendi!`, 'success');
                          }
                        }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-form-column">
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">ÜRÜN FİYATI (Örn: $24.99)</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      required
                    />
                  </div>

                  <TagInput
                    label="ETİKETLER / BADGES (TR)"
                    tags={editingProduct.badges?.tr || []}
                    onChange={newTags => setEditingProduct({
                      ...editingProduct,
                      badges: { ...(editingProduct.badges || {}), tr: newTags }
                    })}
                    placeholder="Etiket yazıp Ekle'ye tıklayın"
                  />

                  <TagInput
                    label="ETİKETLER / BADGES (EN)"
                    tags={editingProduct.badges?.en || []}
                    onChange={newTags => setEditingProduct({
                      ...editingProduct,
                      badges: { ...(editingProduct.badges || {}), en: newTags }
                    })}
                    placeholder="Type badge and click Add"
                  />
                </div>
              </div>

              {/* Side by Side Localized Inputs */}
              <div className="admin-split-editor">
                {/* Turkish Side */}
                <div className="split-pane">
                  <div className="split-pane-header">TURKISH TRANSLATIONS</div>
                  
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">ÜRÜN ADI (TR)</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.name.tr}
                      onChange={e => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, tr: e.target.value } })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">AÇIKLAMA PARAGRAFI (TR)</label>
                    <textarea
                      rows="4"
                      className="admin-field-textarea"
                      value={editingProduct.description.tr}
                      onChange={e => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, tr: e.target.value } })}
                      required
                    />
                  </div>

                  <TagInput
                    label="ÜRÜN ÖZELLİKLERİ (TR)"
                    tags={editingProduct.features?.tr || []}
                    onChange={newFeatures => setEditingProduct({
                      ...editingProduct,
                      features: { ...(editingProduct.features || {}), tr: newFeatures }
                    })}
                    placeholder="Özellik yazıp Ekle'ye tıklayın"
                  />

                  <TagInput
                    label="KURULUM ADIMLARI (TR)"
                    tags={editingProduct.installation?.tr || []}
                    onChange={newInstall => setEditingProduct({
                      ...editingProduct,
                      installation: { ...(editingProduct.installation || {}), tr: newInstall }
                    })}
                    placeholder="Kurulum adımı yazıp Ekle'ye tıklayın"
                  />
                </div>

                {/* English Side */}
                <div className="split-pane">
                  <div className="split-pane-header">ENGLISH TRANSLATIONS</div>
                  
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">PRODUCT NAME (EN)</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.name.en}
                      onChange={e => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, en: e.target.value } })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-field-label">DESCRIPTION PARAGRAPH (EN)</label>
                    <textarea
                      rows="4"
                      className="admin-field-textarea"
                      value={editingProduct.description.en}
                      onChange={e => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, en: e.target.value } })}
                      required
                    />
                  </div>

                  <TagInput
                    label="PRODUCT FEATURES (EN)"
                    tags={editingProduct.features?.en || []}
                    onChange={newFeatures => setEditingProduct({
                      ...editingProduct,
                      features: { ...(editingProduct.features || {}), en: newFeatures }
                    })}
                    placeholder="Type feature and click Add"
                  />

                  <TagInput
                    label="INSTALLATION GUIDE (EN)"
                    tags={editingProduct.installation?.en || []}
                    onChange={newInstall => setEditingProduct({
                      ...editingProduct,
                      installation: { ...(editingProduct.installation || {}), en: newInstall }
                    })}
                    placeholder="Type step and click Add"
                  />
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <h4 className="font-display font-bold" style={{ fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>
                  TEKNİK TABLO DETAYLARI
                </h4>
                <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div>
                    <label className="admin-field-label">DOSYA BOYUTU</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.specs.fileSize}
                      onChange={e => setEditingProduct({ ...editingProduct, specs: { ...editingProduct.specs, fileSize: e.target.value } })}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">PLATFORM</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.specs.platform}
                      onChange={e => setEditingProduct({ ...editingProduct, specs: { ...editingProduct.specs, platform: e.target.value } })}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">LİSANS TİPİ</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.specs.license}
                      onChange={e => setEditingProduct({ ...editingProduct, specs: { ...editingProduct.specs, license: e.target.value } })}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">TESLİMAT FORMATI</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editingProduct.specs.format}
                      onChange={e => setEditingProduct({ ...editingProduct, specs: { ...editingProduct.specs, format: e.target.value } })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="admin-cancel-btn">
                  Değişiklikleri İptal Et
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
                  Diske Kaydet
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Translation/Sections Editor */}
          {activeTab === 'sections' && (
            <form onSubmit={handleSectionSave} className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              
              <div className="admin-accordion-container">
                
                {/* Group 1: Giriş & Menüler */}
                <div className={`admin-accordion-item ${activeAccordionGroup === 'intro' ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="admin-accordion-header"
                    onClick={() => setActiveAccordionGroup(activeAccordionGroup === 'intro' ? null : 'intro')}
                  >
                    <div className="admin-accordion-header-left">
                      <span className="admin-accordion-icon">🏠</span>
                      <div className="admin-accordion-title-box">
                        <span className="admin-accordion-title">Giriş & Menüler</span>
                        <span className="admin-accordion-desc">Navigasyon menü bağlantıları, kayan duyurular ve giriş ekranı (Hero) başlıkları.</span>
                      </div>
                    </div>
                    <span className="admin-accordion-caret">▼</span>
                  </button>
                  
                  {activeAccordionGroup === 'intro' && (
                    <div className="admin-accordion-content">
                      <h4 className="admin-field-label-group">📍 Navigasyon Link Başlıkları</h4>
                      {renderSimpleFields('nav', [
                        { key: 'about', label: 'Hakkımızda Buton Etiketi' },
                        { key: 'gallery', label: 'Galeri Buton Etiketi' },
                        { key: 'products', label: 'Ürünler Buton Etiketi' },
                        { key: 'services', label: 'Hizmetler Buton Etiketi' },
                        { key: 'pricing', label: 'Fiyatlar Buton Etiketi' },
                        { key: 'faq', label: 'SSS Buton Etiketi' },
                        { key: 'contact', label: 'İletişim Buton Etiketi' }
                      ])}
                      
                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>📢 Kayan Duyuru Metinleri (Marquee)</h4>
                      <div className="admin-split-editor" style={{ marginBottom: '1.5rem', gap: '1.5rem' }}>
                        <div className="split-pane">
                          <div className="split-pane-header">TURKISH TEXTS</div>
                          <div style={{ marginBottom: '1.25rem' }}>
                            <label className="admin-field-label">Duyurular (Virgülle Ayırın)</label>
                            <textarea
                              rows="3"
                              className="admin-field-textarea"
                              value={trData.marquee.join(', ')}
                              onChange={e => handleTextChange('tr', 'marquee', null, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              required
                            />
                          </div>
                        </div>
                        <div className="split-pane">
                          <div className="split-pane-header">ENGLISH TEXTS</div>
                          <div style={{ marginBottom: '1.25rem' }}>
                            <label className="admin-field-label">Phrases (Separate with Commas)</label>
                            <textarea
                              rows="3"
                              className="admin-field-textarea"
                              value={enData.marquee.join(', ')}
                              onChange={e => handleTextChange('en', 'marquee', null, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>✨ Hero Giriş Ekranı</h4>
                      {renderSimpleFields('hero', [
                        { key: 'badge', label: 'Giriş Üst Etiketi (Badge)' },
                        { key: 'line1', label: 'H1 Başlık Satırı 1' },
                        { key: 'line2', label: 'H1 Başlık Satırı 2 (Çerçeveli)' },
                        { key: 'line3', label: 'H1 Başlık Satırı 3 (Glow / Işıklı)' },
                        { key: 'sub', label: 'Alt Başlık / Paragraf', type: 'textarea' },
                        { key: 'cta', label: 'Mağaza Butonu (Sol)' },
                        { key: 'ctaSecondary', label: 'İletişim Butonu (Sağ)' },
                        { key: 'scroll', label: 'Aşağı Kaydır Yazısı' }
                      ])}
                    </div>
                  )}
                </div>

                {/* Group 2: Hakkımızda & Güven */}
                <div className={`admin-accordion-item ${activeAccordionGroup === 'about_trust' ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="admin-accordion-header"
                    onClick={() => setActiveAccordionGroup(activeAccordionGroup === 'about_trust' ? null : 'about_trust')}
                  >
                    <div className="admin-accordion-header-left">
                      <span className="admin-accordion-icon">🛡️</span>
                      <div className="admin-accordion-title-box">
                        <span className="admin-accordion-title">Hakkımızda & Güven Unsurları</span>
                        <span className="admin-accordion-desc">Hakkımızda yazısı, istatistik sayaçları, canlı chat simülasyonu ve neden biz kartları.</span>
                      </div>
                    </div>
                    <span className="admin-accordion-caret">▼</span>
                  </button>

                  {activeAccordionGroup === 'about_trust' && (
                    <div className="admin-accordion-content">
                      <h4 className="admin-field-label-group">📖 Hakkımızda Detayları</h4>
                      {renderSimpleFields('about', [
                        { key: 'badge', label: 'Hakkımda Üst Etiket' },
                        { key: 'title', label: 'Hakkımda Başlık' },
                        { key: 'p1', label: 'Hakkımda Paragraf 1', type: 'textarea' },
                        { key: 'p2', label: 'Hakkımda Paragraf 2', type: 'textarea' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>📈 Hakkımızda Sayaç İstatistikleri</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {['stat1', 'stat2', 'stat3'].map(key => (
                          <div key={key} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                            <div style={{ width: '90px' }}>
                              <label className="admin-field-label">Sayı (Ortak)</label>
                              <input type="number" className="admin-field-input" value={trData.about[key].value} onChange={e => handleSharedChange('about', key, Number(e.target.value), null, 'value')} />
                            </div>
                            <div style={{ width: '60px' }}>
                              <label className="admin-field-label">Sonsöz</label>
                              <input className="admin-field-input" value={trData.about[key].suffix} onChange={e => handleSharedChange('about', key, e.target.value, null, 'suffix')} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label className="admin-field-label">Etiket (TR)</label>
                              <input className="admin-field-input" value={trData.about[key].label} onChange={e => handleTextChange('tr', 'about', key, e.target.value, null, 'label')} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label className="admin-field-label">Etiket (EN)</label>
                              <input className="admin-field-input" value={enData.about[key].label} onChange={e => handleTextChange('en', 'about', key, e.target.value, null, 'label')} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>🤝 Güvenlik & Destek Simülasyonu</h4>
                      {renderSimpleFields('trust', [
                        { key: 'badge', label: 'Güven Üst Etiket' },
                        { key: 'title', label: 'Güven Bölümü Başlığı' },
                        { key: 'online', label: 'Çevrimiçi Etiketi' },
                        { key: 'delivered', label: 'İletildi Etiketi' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>💬 Canlı Sohbet Mesaj Simülasyonu</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {trData.trust.messages.map((msg, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 60px', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                            <div>
                              <label className="admin-field-label">Gönderen (Ortak)</label>
                              <select className="admin-field-input" value={msg.role} onChange={e => handleSharedChange('trust', 'messages', e.target.value, idx, 'role')}>
                                <option value="client">Müşteri (Sol)</option>
                                <option value="support">Destek (Sağ)</option>
                              </select>
                            </div>
                            <div>
                              <label className="admin-field-label">Mesaj (TR)</label>
                              <input type="text" className="admin-field-input" value={msg.text} onChange={e => handleTextChange('tr', 'trust', 'messages', e.target.value, idx, 'text')} />
                            </div>
                            <div>
                              <label className="admin-field-label">Message (EN)</label>
                              <input type="text" className="admin-field-input" value={enData.trust.messages[idx]?.text || ''} onChange={e => handleTextChange('en', 'trust', 'messages', e.target.value, idx, 'text')} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <button type="button" onClick={() => removeItem('trust', 'messages', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.5rem', width: '100%' }}>SİL</button>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('trust', 'messages', { role: 'client', text: '' }, { role: 'client', text: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Mesaj Ekle</button>
                      </div>

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>🌟 Neden Biz Kartları</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)' }}>
                        {trData.trust.stats.map((st, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <div style={{ width: '120px' }}>
                                <label className="admin-field-label">Değer / Metrik</label>
                                <input className="admin-field-input" value={st.value} onChange={e => handleSharedChange('trust', 'stats', e.target.value, idx, 'value')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Kart Efekt Rengi (Ortak)</label>
                                <input className="admin-field-input" value={st.glow} onChange={e => handleSharedChange('trust', 'stats', e.target.value, idx, 'glow')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Başlık (TR)</label>
                                <input className="admin-field-input" value={st.label} onChange={e => handleTextChange('tr', 'trust', 'stats', e.target.value, idx, 'label')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Title (EN)</label>
                                <input className="admin-field-input" value={enData.trust.stats[idx]?.label || ''} onChange={e => handleTextChange('en', 'trust', 'stats', e.target.value, idx, 'label')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Açıklama (TR)</label>
                                <textarea rows="2" className="admin-field-textarea" value={st.desc} onChange={e => handleTextChange('tr', 'trust', 'stats', e.target.value, idx, 'desc')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Description (EN)</label>
                                <textarea rows="2" className="admin-field-textarea" value={enData.trust.stats[idx]?.desc || ''} onChange={e => handleTextChange('en', 'trust', 'stats', e.target.value, idx, 'desc')} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Group 3: Hizmetler, Süreç & Galeri */}
                <div className={`admin-accordion-item ${activeAccordionGroup === 'services_process' ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="admin-accordion-header"
                    onClick={() => setActiveAccordionGroup(activeAccordionGroup === 'services_process' ? null : 'services_process')}
                  >
                    <div className="admin-accordion-header-left">
                      <span className="admin-accordion-icon">⚡</span>
                      <div className="admin-accordion-title-box">
                        <span className="admin-accordion-title">Hizmetler, Süreçler & Galeri Başlıkları</span>
                        <span className="admin-accordion-desc">Hizmet listesi, çalışma adımları ve Bento Galeri başlıkları/tab etiketleri.</span>
                      </div>
                    </div>
                    <span className="admin-accordion-caret">▼</span>
                  </button>

                  {activeAccordionGroup === 'services_process' && (
                    <div className="admin-accordion-content">
                      <h4 className="admin-field-label-group">🛠️ Sunulan Hizmetler</h4>
                      {renderSimpleFields('services', [
                        { key: 'badge', label: 'Hizmetler Üst Etiket' },
                        { key: 'title', label: 'Hizmetler Bölümü Başlığı' },
                        { key: 'subtitle', label: 'Hizmetler Açıklama Metni', type: 'textarea' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>🛠️ Sunulan Hizmet Listesi</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {trData.services.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                              <div style={{ width: '80px' }}>
                                <label className="admin-field-label">İkon (Ortak)</label>
                                <input className="admin-field-input" value={item.icon} onChange={e => handleSharedChange('services', 'items', e.target.value, idx, 'icon')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Hizmet Adı (TR)</label>
                                <input className="admin-field-input" value={item.title} onChange={e => handleTextChange('tr', 'services', 'items', e.target.value, idx, 'title')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Service Name (EN)</label>
                                <input className="admin-field-input" value={enData.services.items[idx]?.title || ''} onChange={e => handleTextChange('en', 'services', 'items', e.target.value, idx, 'title')} />
                              </div>
                              <div>
                                <button type="button" onClick={() => removeItem('services', 'items', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.5rem 1rem' }}>SİL</button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Açıklama (TR)</label>
                                <textarea rows="2" className="admin-field-textarea" value={item.desc} onChange={e => handleTextChange('tr', 'services', 'items', e.target.value, idx, 'desc')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Description (EN)</label>
                                <textarea rows="2" className="admin-field-textarea" value={enData.services.items[idx]?.desc || ''} onChange={e => handleTextChange('en', 'services', 'items', e.target.value, idx, 'desc')} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('services', 'items', { icon: '◈', title: '', desc: '' }, { icon: '◈', title: '', desc: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Hizmet Ekle</button>
                      </div>

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>👣 Çalışma Süreci (Nasıl Çalışır?)</h4>
                      {renderSimpleFields('process', [
                        { key: 'badge', label: 'Süreç Üst Etiket' },
                        { key: 'title', label: 'Süreç Bölümü Başlığı' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>👣 Çalışma Adımları</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {trData.process.steps.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                              <div style={{ width: '80px' }}>
                                <label className="admin-field-label">Sayı (Ortak)</label>
                                <input className="admin-field-input" value={step.num} onChange={e => handleSharedChange('process', 'steps', e.target.value, idx, 'num')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Adım Başlığı (TR)</label>
                                <input className="admin-field-input" value={step.title} onChange={e => handleTextChange('tr', 'process', 'steps', e.target.value, idx, 'title')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Step Title (EN)</label>
                                <input className="admin-field-input" value={enData.process.steps[idx]?.title || ''} onChange={e => handleTextChange('en', 'process', 'steps', e.target.value, idx, 'title')} />
                              </div>
                              <div>
                                <button type="button" onClick={() => removeItem('process', 'steps', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.5rem 1rem' }}>SİL</button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Açıklama (TR)</label>
                                <textarea rows="2" className="admin-field-textarea" value={step.desc} onChange={e => handleTextChange('tr', 'process', 'steps', e.target.value, idx, 'desc')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Description (EN)</label>
                                <textarea rows="2" className="admin-field-textarea" value={enData.process.steps[idx]?.desc || ''} onChange={e => handleTextChange('en', 'process', 'steps', e.target.value, idx, 'desc')} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('process', 'steps', { num: '01', title: '', desc: '' }, { num: '01', title: '', desc: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Adım Ekle</button>
                      </div>

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>🖼️ Bento Galeri Bölümü Metinleri</h4>
                      {renderSimpleFields('gallery', [
                        { key: 'badge', label: 'Galeri Üst Etiket' },
                        { key: 'title', label: 'Galeri Ana Başlığı' },
                        { key: 'subtitle', label: 'Galeri Alt Başlığı' },
                        { key: 'all', label: 'Filtre Tab: Tümü' },
                        { key: 'jacket', label: 'Filtre Tab: Ceketler' },
                        { key: 'top', label: 'Filtre Tab: Üst Giyim' },
                        { key: 'pants', label: 'Filtre Tab: Pantolonlar' },
                        { key: 'set', label: 'Filtre Tab: Kombinler' },
                        { key: 'hover', label: 'Görsel Hover Yazısı' }
                      ])}
                    </div>
                  )}
                </div>

                {/* Group 4: Fiyatlar & Yorumlar */}
                <div className={`admin-accordion-item ${activeAccordionGroup === 'pricing_reviews' ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="admin-accordion-header"
                    onClick={() => setActiveAccordionGroup(activeAccordionGroup === 'pricing_reviews' ? null : 'pricing_reviews')}
                  >
                    <div className="admin-accordion-header-left">
                      <span className="admin-accordion-icon">💰</span>
                      <div className="admin-accordion-title-box">
                        <span className="admin-accordion-title">Fiyat Paketleri & Müşteri Yorumları</span>
                        <span className="admin-accordion-desc">Lisans fiyat kartları, kurumsal teklif yazıları ve referans yorumları.</span>
                      </div>
                    </div>
                    <span className="admin-accordion-caret">▼</span>
                  </button>

                  {activeAccordionGroup === 'pricing_reviews' && (
                    <div className="admin-accordion-content">
                      <h4 className="admin-field-label-group">💵 Lisans Paketleri & Fiyatlar</h4>
                      {renderSimpleFields('pricing', [
                        { key: 'badge', label: 'Fiyatlar Üst Etiket' },
                        { key: 'title', label: 'Fiyatlar Bölüm Başlığı' },
                        { key: 'subtitle', label: 'Fiyatlar Açıklama Metni', type: 'textarea' },
                        { key: 'toggleEscrow', label: 'Escrow (Kilitli Paket) Buton Etiketi' },
                        { key: 'toggleOpen', label: 'Open Source (Açık Kaynak) Buton Etiketi' },
                        { key: 'toggleLabel', label: 'Paket Değiştirme İpucu Yazısı' },
                        { key: 'corporate', label: 'Kurumsal Özel İstek Alanı Başlığı' },
                        { key: 'contactUs', label: 'Kurumsal Buton Yazısı' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>🔒 Escrow Lisans Paket Kartları</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {trData.pricing.escrow.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                              <div style={{ width: '100px' }}>
                                <label className="admin-field-label">Fiyat (Ortak)</label>
                                <input className="admin-field-input" value={item.price} onChange={e => handleSharedChange('pricing', 'escrow', e.target.value, idx, 'price')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Paket Adı (TR)</label>
                                <input className="admin-field-input" value={item.name} onChange={e => handleTextChange('tr', 'pricing', 'escrow', e.target.value, idx, 'name')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Plan Name (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.escrow[idx]?.name || ''} onChange={e => handleTextChange('en', 'pricing', 'escrow', e.target.value, idx, 'name')} />
                              </div>
                              <div>
                                <button type="button" onClick={() => removeItem('pricing', 'escrow', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.5rem 1rem' }}>SİL</button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Periyot / Tip (TR)</label>
                                <input className="admin-field-input" value={item.period} onChange={e => handleTextChange('tr', 'pricing', 'escrow', e.target.value, idx, 'period')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Period / Type (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.escrow[idx]?.period || ''} onChange={e => handleTextChange('en', 'pricing', 'escrow', e.target.value, idx, 'period')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Buton CTA (TR)</label>
                                <input className="admin-field-input" value={item.cta} onChange={e => handleTextChange('tr', 'pricing', 'escrow', e.target.value, idx, 'cta')} />
                              </div>
                              <div>
                                <label className="admin-field-label">CTA Text (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.escrow[idx]?.cta || ''} onChange={e => handleTextChange('en', 'pricing', 'escrow', e.target.value, idx, 'cta')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Açıklama (TR)</label>
                                <input className="admin-field-input" value={item.desc} onChange={e => handleTextChange('tr', 'pricing', 'escrow', e.target.value, idx, 'desc')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Description (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.escrow[idx]?.desc || ''} onChange={e => handleTextChange('en', 'pricing', 'escrow', e.target.value, idx, 'desc')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Özellikler (TR - Her satıra bir adet)</label>
                                <textarea rows="3" className="admin-field-textarea" value={item.features.join('\n')} onChange={e => handleTextChange('tr', 'pricing', 'escrow', e.target.value.split('\n').map(s => s.trim()).filter(Boolean), idx, 'features')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Features (EN - One per line)</label>
                                <textarea rows="3" className="admin-field-textarea" value={enData.pricing.escrow[idx]?.features.join('\n') || ''} onChange={e => handleTextChange('en', 'pricing', 'escrow', e.target.value.split('\n').map(s => s.trim()).filter(Boolean), idx, 'features')} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('pricing', 'escrow', { name: '', price: '', period: '', desc: '', features: [], cta: '' }, { name: '', price: '', period: '', desc: '', features: [], cta: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Escrow Paket Ekle</button>
                      </div>

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>📂 Open Source (Açık Kaynak) Lisans Paketleri</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {trData.pricing.openSource.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                              <div style={{ width: '100px' }}>
                                <label className="admin-field-label">Fiyat (Ortak)</label>
                                <input className="admin-field-input" value={item.price} onChange={e => handleSharedChange('pricing', 'openSource', e.target.value, idx, 'price')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Paket Adı (TR)</label>
                                <input className="admin-field-input" value={item.name} onChange={e => handleTextChange('tr', 'pricing', 'openSource', e.target.value, idx, 'name')} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Plan Name (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.openSource[idx]?.name || ''} onChange={e => handleTextChange('en', 'pricing', 'openSource', e.target.value, idx, 'name')} />
                              </div>
                              <div>
                                <button type="button" onClick={() => removeItem('pricing', 'openSource', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.5rem 1rem' }}>SİL</button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Periyot / Tip (TR)</label>
                                <input className="admin-field-input" value={item.period} onChange={e => handleTextChange('tr', 'pricing', 'openSource', e.target.value, idx, 'period')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Period / Type (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.openSource[idx]?.period || ''} onChange={e => handleTextChange('en', 'pricing', 'openSource', e.target.value, idx, 'period')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Buton CTA (TR)</label>
                                <input className="admin-field-input" value={item.cta} onChange={e => handleTextChange('tr', 'pricing', 'openSource', e.target.value, idx, 'cta')} />
                              </div>
                              <div>
                                <label className="admin-field-label">CTA Text (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.openSource[idx]?.cta || ''} onChange={e => handleTextChange('en', 'pricing', 'openSource', e.target.value, idx, 'cta')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Açıklama (TR)</label>
                                <input className="admin-field-input" value={item.desc} onChange={e => handleTextChange('tr', 'pricing', 'openSource', e.target.value, idx, 'desc')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Description (EN)</label>
                                <input className="admin-field-input" value={enData.pricing.openSource[idx]?.desc || ''} onChange={e => handleTextChange('en', 'pricing', 'openSource', e.target.value, idx, 'desc')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Özellikler (TR - Her satıra bir adet)</label>
                                <textarea rows="3" className="admin-field-textarea" value={item.features.join('\n')} onChange={e => handleTextChange('tr', 'pricing', 'openSource', e.target.value.split('\n').map(s => s.trim()).filter(Boolean), idx, 'features')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Features (EN - One per line)</label>
                                <textarea rows="3" className="admin-field-textarea" value={enData.pricing.openSource[idx]?.features.join('\n') || ''} onChange={e => handleTextChange('en', 'pricing', 'openSource', e.target.value.split('\n').map(s => s.trim()).filter(Boolean), idx, 'features')} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('pricing', 'openSource', { name: '', price: '', period: '', desc: '', features: [], cta: '' }, { name: '', price: '', period: '', desc: '', features: [], cta: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Open Source Ekle</button>
                      </div>

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>💬 Müşteri Referans Yorumları</h4>
                      {renderSimpleFields('reviews', [
                        { key: 'badge', label: 'Yorumlar Üst Etiket' },
                        { key: 'title', label: 'Yorumlar Bölüm Başlığı' },
                        { key: 'subtitle', label: 'Yorumlar Alt Başlığı', type: 'textarea' },
                        { key: 'rating', label: 'Genel Oran (Ortak)' },
                        { key: 'ratingLabel', label: 'Skor Açıklama Metni' },
                        { key: 'prev', label: 'Önceki Butonu Metni' },
                        { key: 'next', label: 'Sonraki Butonu Metni' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>💬 Müşteri Yorum Listesi</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)' }}>
                        {trData.reviews.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                              <div style={{ flex: 1 }}>
                                <label className="admin-field-label">Müşteri Adı (Ortak)</label>
                                <input className="admin-field-input" value={item.author} onChange={e => handleSharedChange('reviews', 'items', e.target.value, idx, 'author')} />
                              </div>
                              <div>
                                <button type="button" onClick={() => removeItem('reviews', 'items', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.5rem 1rem' }}>SİL</button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Yorum (TR)</label>
                                <textarea rows="2" className="admin-field-textarea" value={item.text} onChange={e => handleTextChange('tr', 'reviews', 'items', e.target.value, idx, 'text')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Review (EN)</label>
                                <textarea rows="2" className="admin-field-textarea" value={enData.reviews.items[idx]?.text || ''} onChange={e => handleTextChange('en', 'reviews', 'items', e.target.value, idx, 'text')} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('reviews', 'items', { author: '', text: '' }, { author: '', text: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Yorum Ekle</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Group 5: SSS, İletişim & Footer */}
                <div className={`admin-accordion-item ${activeAccordionGroup === 'faq_footer' ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="admin-accordion-header"
                    onClick={() => setActiveAccordionGroup(activeAccordionGroup === 'faq_footer' ? null : 'faq_footer')}
                  >
                    <div className="admin-accordion-header-left">
                      <span className="admin-accordion-icon">💬</span>
                      <div className="admin-accordion-title-box">
                        <span className="admin-accordion-title">FAQ, İletişim & Alt Bilgi (Footer)</span>
                        <span className="admin-accordion-desc">Soru-Cevap başlıkları, iletişim daveti ve en alttaki link/telif hakları.</span>
                      </div>
                    </div>
                    <span className="admin-accordion-caret">▼</span>
                  </button>

                  {activeAccordionGroup === 'faq_footer' && (
                    <div className="admin-accordion-content">
                      <h4 className="admin-field-label-group">❓ Sıkça Sorulan Sorular</h4>
                      {renderSimpleFields('faq', [
                        { key: 'badge', label: 'SSS Üst Etiket' },
                        { key: 'titleA', label: 'Başlık Satırı 1' },
                        { key: 'titleB', label: 'Başlık Satırı 2 (Glowlu)' },
                        { key: 'titleC', label: 'Başlık Satırı 3' },
                        { key: 'subtitle', label: 'SSS Açıklama Metni', type: 'textarea' }
                      ])}

                      <h5 className="admin-field-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>❓ SSS Soru & Cevap Listesi</h5>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                        {trData.faq.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <button type="button" onClick={() => removeItem('faq', 'items', idx)} className="admin-action-btn delete-btn" style={{ padding: '0.35rem 0.75rem' }}>SİL</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Soru (TR)</label>
                                <input type="text" className="admin-field-input" value={item.q} onChange={e => handleTextChange('tr', 'faq', 'items', e.target.value, idx, 'q')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Question (EN)</label>
                                <input type="text" className="admin-field-input" value={enData.faq.items[idx]?.q || ''} onChange={e => handleTextChange('en', 'faq', 'items', e.target.value, idx, 'q')} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <label className="admin-field-label">Cevap (TR)</label>
                                <textarea rows="3" className="admin-field-textarea" value={item.a} onChange={e => handleTextChange('tr', 'faq', 'items', e.target.value, idx, 'a')} />
                              </div>
                              <div>
                                <label className="admin-field-label">Answer (EN)</label>
                                <textarea rows="3" className="admin-field-textarea" value={enData.faq.items[idx]?.a || ''} onChange={e => handleTextChange('en', 'faq', 'items', e.target.value, idx, 'a')} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addItem('faq', 'items', { q: '', a: '' }, { q: '', a: '' })} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>+ Soru Ekle</button>
                      </div>

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>📞 İletişim Paneli</h4>
                      {renderSimpleFields('contact', [
                        { key: 'badge', label: 'İletişim Üst Etiket' },
                        { key: 'line1', label: 'İletişim Başlık Satır 1' },
                        { key: 'line2', label: 'İletişim Başlık Satır 2' },
                        { key: 'line3', label: 'İletişim Başlık Satır 3' },
                        { key: 'sub', label: 'Alt Başlık / Davet Açıklaması', type: 'textarea' },
                        { key: 'discord', label: 'Discord Buton Metni' },
                        { key: 'or', label: 'Alternatif Bağlantı Metni (Veya)' }
                      ])}

                      <h4 className="admin-field-label-group" style={{ marginTop: '2rem' }}>👣 Footer Alt Bilgi & Bağlantıları</h4>
                      {renderSimpleFields('footer', [
                        { key: 'rights', label: 'Telif Hakkı Metni' },
                        { key: 'tagline', label: 'Footer Marka Sloganı', type: 'textarea' },
                        { key: 'colLegal', label: 'Link Kolon Başlığı: Yasal' },
                        { key: 'colSocials', label: 'Link Kolon Başlığı: Sosyal Medya' },
                        { key: 'colSupport', label: 'Link Kolon Başlığı: Destek' },
                        { key: 'terms', label: 'Bağlantı: Satış Koşulları' },
                        { key: 'privacy', label: 'Bağlantı: Gizlilik Politikası' },
                        { key: 'impressum', label: 'Bağlantı: Künye / Impressum' },
                        { key: 'youtube', label: 'Bağlantı: Youtube Kanalı' },
                        { key: 'discord', label: 'Bağlantı: Discord Sunucusu' },
                        { key: 'ticketSupport', label: 'Bağlantı: Destek Talebi' },
                        { key: 'documentation', label: 'Bağlantı: Dökümantasyon' }
                      ])}
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
                  Değişiklikleri Diske Kaydet
                </button>
              </div>
            </form>
          )}
          {/* Tab: Admin Destek Talepleri */}
          {activeTab === 'admin_tickets' && !selectedPortalTicket && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>💬 Gelen Destek Talepleri</h3>
                <button onClick={loadPortalData} className="btn-outlined-modern" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>🔄 Yenile</button>
              </div>

              <div className="admin-table-scroll-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bilet ID</th>
                      <th>Kullanıcı</th>
                      <th>Başlık / Konu</th>
                      <th>Kategori</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                      <th style={{ textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portalTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{ticket.id.substring(0, 12)}</td>
                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ticket.username}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{ticket.userEmail}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{ticket.title}</td>
                        <td style={{ fontSize: '0.75rem' }}>{ticket.category}</td>
                        <td>
                          <span 
                            className="admin-tag-chip" 
                            style={{ 
                              background: ticket.status === 'resolved' 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : ticket.status === 'answered' 
                                ? 'rgba(139, 92, 246, 0.1)' 
                                : 'rgba(245, 158, 11, 0.1)',
                              border: ticket.status === 'resolved' 
                                ? '1px solid rgba(16, 185, 129, 0.3)' 
                                : ticket.status === 'answered' 
                                ? '1px solid rgba(139, 92, 246, 0.3)' 
                                : '1px solid rgba(245, 158, 11, 0.3)',
                              color: ticket.status === 'resolved' 
                                ? '#10b981' 
                                : ticket.status === 'answered' 
                                ? '#8b5cf6' 
                                : '#f59e0b'
                            }}
                          >
                            {ticket.status === 'resolved' ? 'Çözüldü' : ticket.status === 'answered' ? 'Cevaplandı' : 'Açık / Yanıt Bekliyor'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem' }}>{new Date(ticket.created).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => setSelectedPortalTicket(ticket)} className="admin-action-btn edit-btn">
                            Yanıtla & Yönet
                          </button>
                        </td>
                      </tr>
                    ))}
                    {portalTickets.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                          Henüz hiçbir destek talebi oluşturulmamış.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admin_tickets' && selectedPortalTicket && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <button onClick={() => setSelectedPortalTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', padding: 0 }}>
                    ← Bilet Listesine Dön
                  </button>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedPortalTicket.title}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Kullanıcı: <strong>{selectedPortalTicket.username}</strong> ({selectedPortalTicket.userEmail}) • Kategori: {selectedPortalTicket.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {selectedPortalTicket.status !== 'resolved' ? (
                    <button 
                      onClick={() => handleUpdateTicketStatus(selectedPortalTicket.id, 'resolved')} 
                      className="admin-action-btn delete-btn"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem' }}
                    >
                      ✔️ Çözüldü Olarak İşaretle
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUpdateTicketStatus(selectedPortalTicket.id, 'open')} 
                      className="admin-action-btn edit-btn"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem' }}
                    >
                      🔓 Yeniden Aç
                    </button>
                  )}
                  <span 
                    className="admin-tag-chip" 
                    style={{ 
                      background: selectedPortalTicket.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      border: selectedPortalTicket.status === 'resolved' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                      color: selectedPortalTicket.status === 'resolved' ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {selectedPortalTicket.status === 'resolved' ? 'Çözüldü' : 'Aktif'}
                  </span>
                </div>
              </div>

              {/* Chat Panel */}
              <div style={{ flex: 1, minHeight: '260px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '10px', background: 'rgba(0,0,0,0.15)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {selectedPortalTicket.messages.map((msg, idx) => {
                  const isClient = msg.role === 'client'
                  return (
                    <div key={idx} style={{ alignSelf: isClient ? 'flex-start' : 'flex-end', maxWidth: '75%', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', alignSelf: isClient ? 'flex-start' : 'flex-end', marginBottom: '0.2rem' }}>
                        {msg.sender} ({isClient ? 'Müşteri' : 'Destek'}) • {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        borderTopRightRadius: isClient ? '12px' : '2px',
                        borderTopLeftRadius: isClient ? '2px' : '12px',
                        background: isClient ? 'rgba(255, 255, 255, 0.06)' : 'var(--accent)',
                        border: isClient ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)',
                        color: isClient ? 'var(--text-primary)' : '#000',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        fontWeight: isClient ? 400 : 600
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAdminReplyTicket} style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="admin-field-input"
                  value={adminReplyText}
                  onChange={e => setAdminReplyText(e.target.value)}
                  placeholder="Müşteriye yanıt yazın..."
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px' }}>
                  Yanıt Gönder
                </button>
              </form>
            </div>
          )}

          {/* Tab: Kullanıcı Yönetimi */}
          {activeTab === 'admin_users' && !editingUserPurchases && !editingUser && !isCreatingUser && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>👥 Kayıtlı Kullanıcılar</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toplam: {portalUsers.length} Kullanıcı</span>
                </div>
                <button 
                  onClick={() => setIsCreatingUser(true)} 
                  className="btn-primary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}
                >
                  + Yeni Kullanıcı Ekle
                </button>
              </div>

              <div className="admin-table-scroll-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Kullanıcı Adı</th>
                      <th>E-posta</th>
                      <th>Durum</th>
                      <th>Kayıt Tarihi</th>
                      <th>Sahip Olduğu Paketler</th>
                      <th style={{ textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portalUsers.map(u => (
                      <tr key={u.email}>
                        <td>
                          <div className="admin-table-avatar">
                            {u.profilePic ? (
                              <img src={u.profilePic} alt="" className="admin-table-avatar-img" />
                            ) : (
                              <div className="admin-table-avatar-placeholder">
                                {u.username ? u.username[0].toUpperCase() : '?'}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{u.username}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{u.email}</td>
                        <td>
                          <span 
                            className="admin-tag-chip" 
                            style={{ 
                              background: u.isBanned ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              border: u.isBanned ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: u.isBanned ? '#ef4444' : '#10b981',
                              fontSize: '0.65rem'
                            }}
                          >
                            {u.isBanned ? 'Yasaklı' : 'Aktif'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem' }}>{new Date(u.created).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {u.purchases && u.purchases.length > 0 ? (
                              u.purchases.map(pid => {
                                const pkg = packagesList.find(p => p.id === pid)
                                return (
                                  <span key={pid} className="admin-tag-chip" style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    {pkg ? pkg.name.tr : `Paket #${pid}`}
                                  </span>
                                )
                              })
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Hiç ürün tanımlanmamış</span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => {
                                setEditingUserPurchases(u)
                                setEditingUserPurchasesList(u.purchases || [])
                              }} 
                              className="admin-action-btn edit-btn"
                              style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                            >
                              Paketler
                            </button>
                            <button 
                              onClick={() => {
                                setEditingUser(u)
                                setEditUserUsername(u.username)
                                setEditUserEmail(u.email)
                                setEditUserPassword('')
                              }} 
                              className="admin-action-btn edit-btn"
                              style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6' }}
                            >
                              Düzenle
                            </button>
                            <button 
                              onClick={() => handleToggleUserBan(u.email)} 
                              className="admin-action-btn delete-btn"
                              style={{ 
                                fontSize: '0.7rem', 
                                padding: '0.3rem 0.6rem', 
                                background: u.isBanned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                border: u.isBanned ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                                color: u.isBanned ? '#10b981' : 'var(--accent)'
                              }}
                            >
                              {u.isBanned ? 'Yasağı Kaldır' : 'Yasakla'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.email)} 
                              className="admin-action-btn delete-btn"
                              style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admin_users' && editingUserPurchases && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>📦 Kullanıcı Satın Alımlarını Düzenle</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0' }}>
                    Kullanıcı: <strong>{editingUserPurchases.username}</strong> ({editingUserPurchases.email})
                  </p>
                </div>
                <button type="button" onClick={() => setEditingUserPurchases(null)} className="admin-close-form-btn">Vazgeç</button>
              </div>

              <form onSubmit={handleSaveUserPurchases}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <label className="admin-field-label">KULLANICIYA TANIMLANACAK PAKETLER</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(0,0,0,0.1)' }}>
                    {packagesList.map(pkg => {
                      const isChecked = editingUserPurchasesList.includes(pkg.id)
                      return (
                        <label key={pkg.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', background: isChecked ? 'rgba(245, 158, 11, 0.05)' : 'transparent', border: isChecked ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid transparent' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingUserPurchasesList([...editingUserPurchasesList, pkg.id])
                              } else {
                                setEditingUserPurchasesList(editingUserPurchasesList.filter(id => id !== pkg.id))
                              }
                            }}
                            style={{ accentColor: 'var(--accent)' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <img src={pkg.images[0]} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{pkg.name.tr}</div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ID: {pkg.id}</span>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setEditingUserPurchases(null)} className="btn-outlined-modern" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>İptal</button>
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 2rem', fontSize: '0.75rem' }}>Kaydet</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'admin_users' && editingUser && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>👥 Kullanıcı Bilgilerini Düzenle</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0' }}>
                    Düzenlenen Hesap: <strong>{editingUser.email}</strong>
                  </p>
                </div>
                <button type="button" onClick={() => setEditingUser(null)} className="admin-close-form-btn">Vazgeç</button>
              </div>

              <form onSubmit={handleSaveUserDetails}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div>
                    <label className="admin-field-label">KULLANICI ADI</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={editUserUsername}
                      onChange={e => setEditUserUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">E-POSTA ADRESİ</label>
                    <input
                      type="email"
                      className="admin-field-input"
                      value={editUserEmail}
                      onChange={e => setEditUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">ŞİFRE DEĞİŞTİR (İSTEĞE BAĞLI)</label>
                    <input
                      type="password"
                      className="admin-field-input"
                      value={editUserPassword}
                      onChange={e => setEditUserPassword(e.target.value)}
                      placeholder="Şifreyi değiştirmek istemiyorsanız boş bırakın"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setEditingUser(null)} className="btn-outlined-modern" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>İptal</button>
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 2rem', fontSize: '0.75rem' }}>Bilgileri Güncelle</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'admin_users' && isCreatingUser && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>👥 Yeni Kullanıcı Ekle</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0' }}>
                    Sisteme el ile yeni bir müşteri kaydı ekleyin.
                  </p>
                </div>
                <button type="button" onClick={() => setIsCreatingUser(false)} className="admin-close-form-btn">Vazgeç</button>
              </div>

              <form onSubmit={handleCreateUser}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div>
                    <label className="admin-field-label">KULLANICI ADI</label>
                    <input
                      type="text"
                      className="admin-field-input"
                      value={createUserUsername}
                      onChange={e => setCreateUserUsername(e.target.value)}
                      placeholder="Kullanıcı adı"
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">E-POSTA ADRESİ</label>
                    <input
                      type="email"
                      className="admin-field-input"
                      value={createUserEmail}
                      onChange={e => setCreateUserEmail(e.target.value)}
                      placeholder="ornek@arven.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">ŞİFRE</label>
                    <input
                      type="password"
                      className="admin-field-input"
                      value={createUserPassword}
                      onChange={e => setCreateUserPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setIsCreatingUser(false)} className="btn-outlined-modern" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>İptal</button>
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 2rem', fontSize: '0.75rem' }}>Hesap Oluştur</button>
                </div>
              </form>
            </div>
          )}

          {/* Tab: İndirme & Sürüm Ayarları */}
          {activeTab === 'admin_downloads' && !editingDownloadPackageId && (
            <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>💾 İndirme Linkleri & Sürüm Güncellemeleri</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Müşterilerin satın aldıkları paketleri indirebilmeleri için linkleri ve sürüm geçmişlerini (changelog) yönetin.</p>
              </div>

              <div className="admin-table-scroll-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ürün Görseli</th>
                      <th>Ürün Adı / ID</th>
                      <th>İndirme Bağlantısı</th>
                      <th>Güncelleme Geçmişi</th>
                      <th style={{ textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagesList.map(pkg => {
                      const dlConfig = portalDownloads[pkg.id] || {}
                      return (
                        <tr key={pkg.id}>
                          <td>
                            <img src={pkg.images[0]} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{pkg.name.tr}</div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID: {pkg.id}</span>
                          </td>
                          <td>
                            {dlConfig.downloadUrl ? (
                              <a href={dlConfig.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                                {dlConfig.downloadUrl.substring(0, 40)}...
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Henüz link tanımlanmamış</span>
                            )}
                          </td>
                          <td style={{ fontSize: '0.75rem' }}>
                            {dlConfig.updates && dlConfig.updates.length > 0 ? (
                              <span className="admin-tag-chip" style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                                {dlConfig.updates.length} Güncelleme Girişi
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Geçmiş bulunmuyor</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              onClick={() => {
                                setEditingDownloadPackageId(pkg.id)
                                setEditingDownloadUrl(dlConfig.downloadUrl || '')
                                setEditingDownloadUpdates(dlConfig.updates || [])
                              }} 
                              className="admin-action-btn edit-btn"
                            >
                              Bağlantı & Sürümleri Düzenle
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admin_downloads' && editingDownloadPackageId && (() => {
            const pkg = packagesList.find(p => p.id === editingDownloadPackageId)
            return (
              <div className="admin-panel-card card-glow-orange" style={{ animation: 'tabFadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>💾 İndirme & Sürüm Detaylarını Düzenle</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Ürün: <strong>{pkg ? pkg.name.tr : `Paket #${editingDownloadPackageId}`}</strong>
                    </p>
                  </div>
                  <button type="button" onClick={() => setEditingDownloadPackageId(null)} className="admin-close-form-btn">Vazgeç</button>
                </div>

                <form onSubmit={handleSaveDownloads}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="admin-field-label">İNDİRME BAĞLANTISI (MEGA / GDRIVE / ONEDRIVE vb.)</label>
                    <input
                      type="url"
                      className="admin-field-input"
                      value={editingDownloadUrl}
                      onChange={e => setEditingDownloadUrl(e.target.value)}
                      placeholder="https://mega.nz/..."
                    />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <h4 className="font-display font-bold" style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '1rem' }}>🆕 YENİ GÜNCELLEME NOTU EKLE</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="admin-field-label">SÜRÜM / GÜNCELLEME BAŞLIĞI</label>
                        <input
                          type="text"
                          className="admin-field-input"
                          value={newUpdateTitle}
                          onChange={e => setNewUpdateTitle(e.target.value)}
                          placeholder="Örn: Sürüm 1.4 Güncellemesi veya Patch v1.1"
                        />
                      </div>
                      <div>
                        <label className="admin-field-label">GÜNCELLEME TARİHİ</label>
                        <input
                          type="text"
                          className="admin-field-input"
                          value={newUpdateDate}
                          onChange={e => setNewUpdateDate(e.target.value)}
                          placeholder="Örn: 22.06.2026"
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-field-label">GÜNCELLEME İÇERİĞİ / DEĞİŞİKLİKLER</label>
                      <textarea
                        rows="4"
                        className="admin-field-textarea"
                        value={newUpdateContent}
                        onChange={e => setNewUpdateContent(e.target.value)}
                        placeholder="- Kıyafet paketine 5 adet yeni hoodie eklendi.&#10;- Dokular optimize edildi.&#10;- Hatalı kaplamalar düzeltildi."
                      />
                    </div>

                    <button type="button" onClick={handleAddUpdateLog} className="btn-primary" style={{ padding: '0.4rem 1.5rem', fontSize: '0.75rem' }}>
                      Log Listesine Ekle
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <h4 className="font-display font-bold" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>📜 KAYITLI GÜNCELLEME GEÇMİŞİ</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {editingDownloadUpdates.map((upd, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', background: 'rgba(0,0,0,0.1)', position: 'relative' }}>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveUpdateLog(idx)}
                            className="admin-action-btn delete-btn"
                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                          >
                            Sil
                          </button>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>{upd.title}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Tarih: {upd.date}</div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-line' }}>{upd.content}</p>
                        </div>
                      ))}
                      {editingDownloadUpdates.length === 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                          Bu paket için henüz hiçbir güncelleme geçmişi bulunmuyor.
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <button type="button" onClick={() => setEditingDownloadPackageId(null)} className="btn-outlined-modern" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>İptal</button>
                    <button type="submit" className="btn-primary" style={{ padding: '0.5rem 2rem', fontSize: '0.75rem' }}>Değişiklikleri Diske Kaydet</button>
                  </div>
                </form>
              </div>
            )
          })()}
        </div>
      </main>

      {/* Pop up banner */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

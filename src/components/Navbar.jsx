import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.127 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

export default function Navbar() {
  const { t, lang, toggleLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = id => {
    const el = document.getElementById(id)
    if (!el) return
    if (window.lenis) window.lenis.scrollTo(el, { offset: -80 })
    else el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  const links = [
    { key: 'about', id: 'about' },
    { key: 'gallery', id: 'gallery' },
    { key: 'services', id: 'services' },
    { key: 'faq', id: 'faq' },
    { key: 'contact', id: 'contact' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={scrolled ? {
        background: 'var(--nav-glass)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--nav-border)',
      } : {}}
    >
      <div className="container-site">
        <div className="flex items-center justify-between" style={{ height: 72 }}>

          {/* Logo */}
          <button
            onClick={() => window.lenis?.scrollTo(0)}
            aria-label="arvenmods"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center',
            }}
          >
            <img className="theme-logo-dark" src="/logo.webp" alt="arvenmods"
              style={{ height: 38, width: 'auto' }} />
            <img className="theme-logo-light" src="/logo-light.webp" alt="arvenmods"
              style={{ height: 38, width: 'auto' }} />
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map(({ key, id }) => (
              <button
                key={key}
                onClick={() => scrollTo(id)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px 0' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {t.nav[key]}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="glass"
              style={{
                borderRadius: 9999, padding: '7px 10px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.1)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Lang toggle */}
            <button
              onClick={toggleLang}
              className="font-display text-xs font-bold tracking-widest transition-all duration-200 glass"
              style={{
                borderRadius: 9999,
                padding: '6px 14px',
                cursor: 'pointer',
                display: 'flex', gap: 6, alignItems: 'center',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.1)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <span style={{ color: lang === 'tr' ? 'var(--accent)' : 'inherit', transition: 'color .2s' }}>TR</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span style={{ color: lang === 'en' ? 'var(--accent)' : 'inherit', transition: 'color .2s' }}>EN</span>
            </button>

            {/* Discord CTA */}
            <a
              href={siteConfig.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-discord-btn"
            >
              <DiscordIcon />
              <span className="nav-discord-label">{t.contact.discord}</span>
            </a>

            {/* Hamburger */}
            <button
              className="flex md:hidden flex-col gap-1.5 p-1"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: 22,
                    height: 1.5,
                    background: mobileOpen ? 'var(--accent)' : 'var(--text-primary)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    transform: mobileOpen
                      ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                      : i === 2 ? 'translateY(-6.5px) rotate(-45deg)'
                      : 'none'
                      : 'none',
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: 'var(--mobile-menu-bg)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid var(--nav-border)',
            padding: '1.5rem',
          }}
        >
          {links.map(({ key, id }) => (
            <button
              key={key}
              onClick={() => scrollTo(id)}
              className="font-display font-bold w-full text-left"
              style={{
                display: 'block',
                fontSize: '1.75rem',
                color: 'var(--text-primary)',
                padding: '0.75rem 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              {t.nav[key]}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

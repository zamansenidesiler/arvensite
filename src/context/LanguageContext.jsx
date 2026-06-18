import { createContext, useContext, useState } from 'react'
import en from '../i18n/en'
import tr from '../i18n/tr'

const translations = { en, tr }
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')

  const toggleLang = () => setLang(prev => {
    const next = prev === 'tr' ? 'en' : 'tr'
    localStorage.setItem('lang', next)
    return next
  })

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)

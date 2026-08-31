import { createContext, useContext, useEffect, useState } from 'react'
import { generalSettings as defaultGeneralSettings } from '../mock-data/platformConfig'

const LOGO_STORAGE_KEY = 'merw-admin-logo'
const LOADER_STORAGE_KEY = 'merw-admin-loader-style'
const GENERAL_SETTINGS_STORAGE_KEY = 'merw-admin-general-settings'

export const LOADER_STYLES = [
  { value: 'bar', label: 'Top Progress Bar' },
  { value: 'spinner', label: 'Center Spinner' },
  { value: 'dots', label: 'Bouncing Dots' },
  { value: 'skeleton', label: 'Skeleton Shimmer' },
]

export const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€' }

// Default platform logo, used for the sidebar, browser tab favicon, and the
// auth pages (Login/Forgot/Reset Password) until an admin uploads a custom one.
export const DEFAULT_LOGO_URL = '/logo.png'

const PlatformSettingsContext = createContext(null)

function applyFavicon(url) {
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = url
}

function loadGeneralSettings() {
  try {
    const stored = localStorage.getItem(GENERAL_SETTINGS_STORAGE_KEY)
    return stored ? { ...defaultGeneralSettings, ...JSON.parse(stored) } : defaultGeneralSettings
  } catch {
    return defaultGeneralSettings
  }
}

export function PlatformSettingsProvider({ children }) {
  const [logoDataUrl, setLogoDataUrl] = useState(() => localStorage.getItem(LOGO_STORAGE_KEY) || null)
  const [loaderStyle, setLoaderStyleState] = useState(
    () => localStorage.getItem(LOADER_STORAGE_KEY) || 'bar'
  )
  const [generalSettings, setGeneralSettingsState] = useState(loadGeneralSettings)

  useEffect(() => {
    applyFavicon(logoDataUrl || DEFAULT_LOGO_URL)
  }, [logoDataUrl])

  useEffect(() => {
    document.title = generalSettings.platformName || 'MERW Admin Panel'
  }, [generalSettings.platformName])

  const setLogo = (dataUrl) => {
    setLogoDataUrl(dataUrl)
    if (dataUrl) {
      localStorage.setItem(LOGO_STORAGE_KEY, dataUrl)
    } else {
      localStorage.removeItem(LOGO_STORAGE_KEY)
    }
  }

  const setLoaderStyle = (style) => {
    setLoaderStyleState(style)
    localStorage.setItem(LOADER_STORAGE_KEY, style)
  }

  const setGeneralSettings = (partial) => {
    setGeneralSettingsState((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem(GENERAL_SETTINGS_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const currencySymbol = CURRENCY_SYMBOLS[generalSettings.defaultCurrency] || '₹'

  return (
    <PlatformSettingsContext.Provider
      value={{
        logoDataUrl,
        logoUrl: logoDataUrl || DEFAULT_LOGO_URL,
        setLogo,
        loaderStyle,
        setLoaderStyle,
        generalSettings,
        setGeneralSettings,
        currencySymbol,
      }}
    >
      {children}
    </PlatformSettingsContext.Provider>
  )
}

export function usePlatformSettings() {
  const ctx = useContext(PlatformSettingsContext)
  if (!ctx) throw new Error('usePlatformSettings must be used within PlatformSettingsProvider')
  return ctx
}

// Convenience hook for components that only need the active currency symbol.
export function useCurrencySymbol() {
  return usePlatformSettings().currencySymbol
}

import { createContext, useContext, useEffect, useState } from 'react'
import { palettes, defaultPaletteKey } from './palettes'

const STORAGE_KEY = 'merw-admin-palette'
const CUSTOM_STORAGE_KEY = 'merw-admin-custom-palette-colors'
const CUSTOM_KEY = 'custom'
const ThemeContext = createContext(null)

function applyColors(colors) {
  const root = document.documentElement
  Object.entries(colors).forEach(([varName, value]) => {
    root.style.setProperty(`--${varName}`, value)
  })
}

function loadCustomColors() {
  try {
    const stored = localStorage.getItem(CUSTOM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function ThemeProvider({ children }) {
  const [paletteKey, setPaletteKeyState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || defaultPaletteKey
  })
  const [customColors, setCustomColorsState] = useState(loadCustomColors)

  const colorsForKey = (key, custom = customColors) =>
    key === CUSTOM_KEY && custom ? custom : (palettes[key] || palettes[defaultPaletteKey]).colors

  useEffect(() => {
    applyColors(colorsForKey(paletteKey))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteKey])

  const setPaletteKey = (key) => {
    setPaletteKeyState(key)
    localStorage.setItem(STORAGE_KEY, key)
  }

  const previewPalette = (key) => {
    applyColors(colorsForKey(key))
  }

  const previewCustomColors = (colors) => {
    applyColors(colors)
  }

  const applyCustomColors = (colors) => {
    setCustomColorsState(colors)
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(colors))
    setPaletteKey(CUSTOM_KEY)
    applyColors(colors)
  }

  const revertPreview = () => {
    applyColors(colorsForKey(paletteKey))
  }

  return (
    <ThemeContext.Provider
      value={{
        paletteKey,
        setPaletteKey,
        previewPalette,
        previewCustomColors,
        applyCustomColors,
        revertPreview,
        palettes,
        customColors,
        CUSTOM_KEY,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

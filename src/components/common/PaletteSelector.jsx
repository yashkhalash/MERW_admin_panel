import { useState } from 'react'
import { Check, Sparkles, Wand2, RefreshCw, Loader2 } from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'
import { useToast } from './ToastContext'
import { usePlatformSettings } from '../../theme/PlatformSettingsContext'
import { extractColorsFromImage } from '../../theme/extractLogoColors'

// Mini mock-UI preview rendered inside each palette card: a tiny "browser strip"
// so the palette's effect is legible at a glance, not just abstract dots.
function MiniPreview({ colors }) {
  return (
    <div
      className="rounded-md border overflow-hidden shadow-sm"
      style={{ borderColor: colors['color-border'] }}
    >
      <div
        className="h-5 flex items-center gap-1 px-2"
        style={{ backgroundColor: colors['color-primary'] }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>
      <div className="flex" style={{ backgroundColor: colors['color-bg'] }}>
        <div
          className="w-6 shrink-0 border-r"
          style={{ backgroundColor: colors['color-surface'], borderColor: colors['color-border'] }}
        >
          <div className="h-1 w-3 mt-1.5 mx-auto rounded-full" style={{ backgroundColor: colors['color-secondary'] }} />
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: colors['color-surface'] }} />
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: colors['color-success'] }} />
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: colors['color-warning'] }} />
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: colors['color-danger'] }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared palette picker with live preview + Apply, used by both the
// Platform Configuration > Appearance tab and the Topbar's quick Settings panel.
export default function PaletteSelector() {
  const {
    paletteKey,
    setPaletteKey,
    previewPalette,
    previewCustomColors,
    applyCustomColors,
    revertPreview,
    palettes,
    customColors,
    CUSTOM_KEY,
  } = useTheme()
  const { logoDataUrl } = usePlatformSettings()
  const { showToast } = useToast()
  const defaultColors = palettes.default.colors

  const [selected, setSelected] = useState(paletteKey)
  const [saved, setSaved] = useState(false)
  const [logoColors, setLogoColors] = useState(customColors)
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')

  const fullLogoColors = logoColors ? { ...defaultColors, ...logoColors } : null

  const handlePreview = (key) => {
    setSelected(key)
    previewPalette(key)
  }

  const handleMatchLogo = async () => {
    setExtracting(true)
    setExtractError('')
    try {
      const colors = await extractColorsFromImage(logoDataUrl)
      setLogoColors(colors)
      setSelected(CUSTOM_KEY)
      previewCustomColors({ ...defaultColors, ...colors })
    } catch (err) {
      setExtractError(err.message || 'Could not extract colors from this logo.')
    } finally {
      setExtracting(false)
    }
  }

  const handleApply = () => {
    if (selected === CUSTOM_KEY && logoColors) {
      applyCustomColors(logoColors)
      showToast('Logo-matched theme applied.')
    } else {
      setPaletteKey(selected)
      showToast(`"${palettes[selected].label}" palette applied.`)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setSelected(paletteKey)
    revertPreview()
  }

  const hasChanges = selected !== paletteKey || (selected === CUSTOM_KEY && logoColors !== customColors)

  return (
    <div>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        Choose a color palette for the admin console, or generate one from your uploaded logo. Selecting
        a palette previews it live — click Apply to save it as the active theme.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {/* Match-my-logo card */}
        {logoDataUrl && (
          <button
            onClick={fullLogoColors ? () => handlePreview(CUSTOM_KEY) : handleMatchLogo}
            disabled={extracting}
            style={{ animation: 'fadeInUp 0.35s ease-out both' }}
            className={`group relative text-left p-3 rounded-lg border-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${
              selected === CUSTOM_KEY
                ? 'border-[var(--color-primary)] shadow-md ring-2 ring-[var(--color-primary)]/15'
                : 'border-dashed border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
            } bg-[var(--color-surface)] disabled:opacity-60`}
          >
            {selected === CUSTOM_KEY && (
              <span
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center z-10"
                style={{ animation: 'popIn 0.3s ease-out' }}
              >
                <Check size={12} className="text-white" strokeWidth={3} />
              </span>
            )}

            <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text)] mb-2 pr-6">
              <Wand2 size={12} className="text-[var(--color-primary)]" /> Matched From Logo
            </span>

            {fullLogoColors ? (
              <>
                <MiniPreview colors={fullLogoColors} />
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex gap-1">
                    {['color-primary', 'color-secondary'].map((c) => (
                      <span
                        key={c}
                        className="w-4 h-4 rounded-full border border-black/5"
                        style={{ backgroundColor: fullLogoColors[c] }}
                      />
                    ))}
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMatchLogo()
                    }}
                    className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {extracting ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <RefreshCw size={11} />
                    )}
                    Re-extract
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-3 text-center">
                <img src={logoDataUrl} alt="Your logo" className="w-9 h-9 rounded-md object-cover" />
                {extracting ? (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <Loader2 size={12} className="animate-spin" /> Extracting colors...
                  </span>
                ) : (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Generate a theme from your logo
                  </span>
                )}
              </div>
            )}
            {extractError && (
              <p className="text-[10px] text-[var(--color-danger)] mt-1.5">{extractError}</p>
            )}
          </button>
        )}

        {Object.entries(palettes).map(([key, palette], index) => {
          const isSelected = selected === key
          return (
            <button
              key={key}
              onClick={() => handlePreview(key)}
              style={{ animation: `fadeInUp 0.35s ease-out both`, animationDelay: `${index * 30}ms` }}
              className={`group relative text-left p-3 rounded-lg border-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${
                isSelected
                  ? 'border-[var(--color-primary)] shadow-md ring-2 ring-[var(--color-primary)]/15'
                  : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
              } bg-[var(--color-surface)]`}
            >
              {isSelected && (
                <span
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center z-10"
                  style={{ animation: 'popIn 0.3s ease-out' }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
              )}
              <span className="text-xs font-medium text-[var(--color-text)] block mb-2 pr-6 truncate">
                {palette.label}
              </span>

              <MiniPreview colors={palette.colors} />

              <div className="flex gap-1 mt-2.5">
                {['color-primary', 'color-secondary', 'color-success', 'color-warning', 'color-danger'].map(
                  (c, i) => (
                    <span
                      key={c}
                      className="w-4 h-4 rounded-full border border-black/5 transition-transform duration-200 group-hover:scale-110"
                      style={{
                        backgroundColor: palette.colors[c],
                        animation: 'swatchIn 0.3s ease-out both',
                        animationDelay: `${index * 30 + i * 25}ms`,
                      }}
                    />
                  )
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleApply}
          disabled={!hasChanges}
          className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          Apply Palette
        </button>
        {hasChanges && (
          <button
            onClick={handleCancel}
            style={{ animation: 'fadeInUp 0.2s ease-out both' }}
            className="px-4 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
          >
            Cancel Preview
          </button>
        )}
        {saved && (
          <span
            style={{ animation: 'fadeInUp 0.25s ease-out both' }}
            className="flex items-center gap-1.5 text-sm text-[var(--color-success)] font-medium"
          >
            <Sparkles size={14} /> Palette applied.
          </span>
        )}
      </div>
    </div>
  )
}

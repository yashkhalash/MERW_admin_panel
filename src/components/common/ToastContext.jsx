import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const LEGACY_POSITION_KEY = 'merw-admin-toast-position'
const LEGACY_POSITIONS_KEY = 'merw-admin-toast-positions'
const STORAGE_KEY = 'merw-admin-toast-positions-xy'

export const DEVICES = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'mobile', label: 'Mobile' },
]

export const TOAST_POSITIONS = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
]

// Every position — preset or dragged — is stored as {x, y} percentages of the
// viewport, clamped so the toast never gets cropped by a screen edge.
export const PRESET_XY = {
  'top-left': { x: 10, y: 8 },
  'top-center': { x: 50, y: 8 },
  'top-right': { x: 90, y: 8 },
  'bottom-left': { x: 10, y: 92 },
  'bottom-center': { x: 50, y: 92 },
  'bottom-right': { x: 90, y: 92 },
}

const DEFAULT_XY = {
  desktop: PRESET_XY['top-center'],
  tablet: PRESET_XY['top-center'],
  mobile: PRESET_XY['top-center'],
}

export function clampXY({ x, y }) {
  return { x: Math.min(94, Math.max(6, x)), y: Math.min(94, Math.max(6, y)) }
}

// Matches a stored {x,y} back to a named preset (for highlighting the picker
// buttons); returns null when the position was freely dragged.
export function matchPreset(xy) {
  const entry = Object.entries(PRESET_XY).find(([, v]) => v.x === xy.x && v.y === xy.y)
  return entry ? entry[0] : null
}

// Tailwind responsive display classes: mobile = base (<640px), tablet = sm..lg
// (640-1023px), desktop = lg+ (>=1024px). Each viewport shows exactly one container.
const DEVICE_VISIBILITY_CLASSES = {
  mobile: 'flex sm:hidden',
  tablet: 'hidden sm:flex lg:hidden',
  desktop: 'hidden lg:flex',
}

const ICONS = {
  success: { Icon: CheckCircle2, color: 'var(--color-success)' },
  error: { Icon: XCircle, color: 'var(--color-danger)' },
  info: { Icon: Info, color: 'var(--color-secondary)' },
}

const ToastContext = createContext(null)

function migrateLegacy() {
  try {
    const legacyObj = localStorage.getItem(LEGACY_POSITIONS_KEY)
    if (legacyObj) {
      const parsed = JSON.parse(legacyObj)
      return {
        desktop: PRESET_XY[parsed.desktop] || DEFAULT_XY.desktop,
        tablet: PRESET_XY[parsed.tablet] || DEFAULT_XY.tablet,
        mobile: PRESET_XY[parsed.mobile] || DEFAULT_XY.mobile,
      }
    }
    const legacyString = localStorage.getItem(LEGACY_POSITION_KEY)
    if (legacyString && PRESET_XY[legacyString]) {
      const xy = PRESET_XY[legacyString]
      return { desktop: xy, tablet: xy, mobile: xy }
    }
  } catch {
    // ignore malformed legacy data
  }
  return DEFAULT_XY
}

function loadPositions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_XY, ...JSON.parse(stored) }
    return migrateLegacy()
  } catch {
    return DEFAULT_XY
  }
}

export function ToastProvider({ children }) {
  const [positions, setPositionsState] = useState(loadPositions)
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'success', duration = 3500) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  // Accepts either a named preset ('top-right', ...) or a raw {x, y} percentage
  // pair (used while dragging the badge in the preview).
  const setPositionFor = (device, positionOrXY) => {
    const xy = clampXY(typeof positionOrXY === 'string' ? PRESET_XY[positionOrXY] : positionOrXY)
    setPositionsState((prev) => {
      const next = { ...prev, [device]: xy }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <ToastContext.Provider value={{ showToast, positions, setPositionFor }}>
      {children}
      {DEVICES.map(({ key }) => (
        <ToastViewport
          key={key}
          toasts={toasts}
          xy={positions[key]}
          onDismiss={dismiss}
          className={DEVICE_VISIBILITY_CLASSES[key]}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function ToastViewport({ toasts, xy, onDismiss, className = 'flex' }) {
  return (
    <div
      className={`fixed z-[200] flex-col gap-2 pointer-events-none ${className}`}
      style={{ left: `${xy.x}%`, top: `${xy.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {toasts.map((t) => {
        const { Icon, color } = ICONS[t.type] || ICONS.success
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-2.5 min-w-[260px] max-w-sm px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg animate-[toastIn_0.2s_ease-out]"
          >
            <Icon size={18} style={{ color }} className="shrink-0 mt-0.5" />
            <p className="flex-1 text-sm text-[var(--color-text)]">{t.message}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

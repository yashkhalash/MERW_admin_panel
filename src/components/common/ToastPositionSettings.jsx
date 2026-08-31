import { useRef, useState } from 'react'
import { Check, Send, Monitor, Tablet, Smartphone, Move } from 'lucide-react'
import { useToast, TOAST_POSITIONS, DEVICES, matchPreset, clampXY } from './ToastContext'

const DEVICE_ICONS = { desktop: Monitor, tablet: Tablet, mobile: Smartphone }

// Frame shape + chrome per device, so the preview actually reads as that device
// rather than a generic empty box.
const DEVICE_FRAMES = {
  desktop: { wrapper: 'w-full h-48', rounded: 'rounded-lg', chrome: 'browser' },
  tablet: { wrapper: 'w-72 h-56 mx-auto', rounded: 'rounded-xl', chrome: 'app' },
  mobile: { wrapper: 'w-44 h-72 mx-auto', rounded: 'rounded-[1.5rem]', chrome: 'phone' },
}

function DeviceFrame({ device, xy, onDrag, dragging, setDragging }) {
  const frame = DEVICE_FRAMES[device]
  const frameRef = useRef(null)

  const updateFromPointer = (clientX, clientY) => {
    const rect = frameRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    onDrag(clampXY({ x, y }))
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    setDragging(true)
    updateFromPointer(e.clientX, e.clientY)

    const handleMove = (moveEvent) => updateFromPointer(moveEvent.clientX, moveEvent.clientY)
    const handleUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <div
      ref={frameRef}
      className={`relative ${frame.wrapper} ${frame.rounded} border-2 border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden shadow-sm select-none`}
    >
      {/* Chrome */}
      {frame.chrome === 'browser' && (
        <div className="h-6 flex items-center gap-1.5 px-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-danger)]/60" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]/60" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)]/60" />
          <span className="ml-2 h-2.5 flex-1 max-w-[60%] rounded-full bg-[var(--color-bg)]" />
        </div>
      )}
      {frame.chrome === 'app' && (
        <div className="h-6 flex items-center justify-center border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="w-10 h-1.5 rounded-full bg-[var(--color-border)]" />
        </div>
      )}
      {frame.chrome === 'phone' && (
        <div className="h-6 flex items-center justify-center border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="w-16 h-3.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]" />
        </div>
      )}

      {/* Faint mock content lines, so the frame reads as a real screen */}
      <div className="absolute inset-0 top-8 flex flex-col gap-1.5 px-3 opacity-40 pointer-events-none">
        <div className="h-1.5 w-2/3 rounded-full bg-[var(--color-border)]" />
        <div className="h-1.5 w-1/2 rounded-full bg-[var(--color-border)]" />
      </div>

      {/* Draggable toast badge */}
      <div
        onPointerDown={handlePointerDown}
        style={{ left: `${xy.x}%`, top: `${xy.y}%`, transform: 'translate(-50%, -50%)', touchAction: 'none' }}
        className={`absolute flex items-center gap-1 px-2 py-1 rounded-md border shadow text-[9px] whitespace-nowrap cursor-grab active:cursor-grabbing ${
          dragging
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] scale-105'
            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]'
        } transition-transform`}
      >
        <Move size={9} className={dragging ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
        Drag me
      </div>

      {/* Phone home indicator */}
      {frame.chrome === 'phone' && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[var(--color-border)]" />
      )}
    </div>
  )
}

export default function ToastPositionSettings() {
  const { positions, setPositionFor, showToast } = useToast()
  const [activeDevice, setActiveDevice] = useState('desktop')
  const [dragging, setDragging] = useState(false)

  const activeXY = positions[activeDevice]
  const activePreset = matchPreset(activeXY)

  return (
    <div>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        Choose where toast notifications appear — pick a preset, or drag the badge in the preview to
        any custom spot. Set a different position for desktop, tablet, and mobile; changes apply
        immediately.
      </p>

      {/* Device switcher */}
      <div className="flex items-center gap-1 mb-4 border-b border-[var(--color-border)]">
        {DEVICES.map(({ key, label }) => {
          const Icon = DEVICE_ICONS[key]
          return (
            <button
              key={key}
              onClick={() => setActiveDevice(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeDevice === key
                  ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          )
        })}
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-2 flex items-center justify-center">
        <DeviceFrame
          device={activeDevice}
          xy={activeXY}
          onDrag={(xy) => setPositionFor(activeDevice, xy)}
          dragging={dragging}
          setDragging={setDragging}
        />
      </div>
      <p className="text-xs text-[var(--color-text-muted)] text-center mb-5">
        {activePreset ? (
          <>
            Current: <span className="font-medium text-[var(--color-text)]">{TOAST_POSITIONS.find((p) => p.value === activePreset)?.label}</span>
          </>
        ) : (
          <>Current: <span className="font-medium text-[var(--color-primary-dark)]">Custom position</span> ({Math.round(activeXY.x)}%, {Math.round(activeXY.y)}%)</>
        )}
      </p>

      {/* Preset picker for the active device */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {TOAST_POSITIONS.map((p, index) => (
          <button
            key={p.value}
            onClick={() => setPositionFor(activeDevice, p.value)}
            style={{ animation: 'fadeInUp 0.3s ease-out both', animationDelay: `${index * 30}ms` }}
            className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border-2 text-sm text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
              activePreset === p.value
                ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)] font-medium ring-2 ring-[var(--color-primary)]/15'
                : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text-muted)]'
            } bg-[var(--color-surface)]`}
          >
            {p.label}
            {activePreset === p.value && <Check size={14} style={{ animation: 'popIn 0.3s ease-out' }} />}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => showToast('This is a preview notification.', 'info')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] active:scale-95 transition-all duration-150"
        >
          <Send size={14} /> Send Test Toast
        </button>
        <span className="text-xs text-[var(--color-text-muted)]">
          Test toasts use your current browser width — resize the window to see each breakpoint live.
        </span>
      </div>
    </div>
  )
}

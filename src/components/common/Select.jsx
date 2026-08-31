import { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

// Themed drop-in replacement for a native <select>. The trigger keeps the same
// classNames selects used before (e.g. fieldInputClass); the open panel is
// portaled to <body> so it always renders on top and follows the current
// palette instead of the browser's native (unthemeable) dropdown chrome.
//
// Controlled usage:            <Select options={...} value={v} onChange={(e) => setV(e.target.value)} />
// react-hook-form usage:       <Controller name="x" control={control} render={({ field }) => <Select options={...} {...field} />} />
//
// `options` accepts either plain strings/numbers or { value, label } objects.
const Select = forwardRef(function Select(
  { options, value, onChange, onBlur, name, placeholder = 'Select...', className = '', disabled = false },
  ref
) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  const normalized = options.map((opt) => (typeof opt === 'object' && opt !== null ? opt : { value: opt, label: opt }))
  const selected = normalized.find((o) => String(o.value) === String(value))

  const updateCoords = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width })
  }

  const setTriggerRef = (node) => {
    triggerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  useEffect(() => {
    if (!open) return
    updateCoords()

    const handlePointerDown = (e) => {
      if (triggerRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return
      setOpen(false)
      onBlur?.({ target: { name, value } })
    }
    const handleReposition = () => updateCoords()

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const toggleOpen = () => {
    if (disabled) return
    setOpen((v) => !v)
  }

  const handleSelect = (opt) => {
    setOpen(false)
    onChange?.({ target: { name, value: opt.value } })
  }

  return (
    <>
      <button
        type="button"
        ref={setTriggerRef}
        onClick={toggleOpen}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center justify-between gap-2 text-left disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <span className={`truncate ${!selected ? 'text-[var(--color-text-muted)]' : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: coords.width }}
            className="z-50 max-h-64 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg py-1"
          >
            {normalized.map((opt) => {
              const isSelected = String(opt.value) === String(value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--color-bg)] ${
                    isSelected ? 'text-[var(--color-primary-dark)] font-medium' : 'text-[var(--color-text)]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="shrink-0" />}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
})

export default Select

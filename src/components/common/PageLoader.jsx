import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePlatformSettings } from '../../theme/PlatformSettingsContext'

// Shows a brief loading indicator on every route change, styled per the admin's
// chosen "Loader Style" (Platform Configuration > General Settings).
// TODO: replace the fixed timeout with real route/data-loading state once pages fetch live data.
export default function PageLoader() {
  const { loaderStyle } = usePlatformSettings()
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 450)
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!visible) return null

  if (loaderStyle === 'bar') {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] animate-[loaderbar_0.45s_ease-in-out]" />
      </div>
    )
  }

  if (loaderStyle === 'spinner') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/40 backdrop-blur-[1px]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin" />
      </div>
    )
  }

  if (loaderStyle === 'dots') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/40 backdrop-blur-[1px]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-bounce"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // skeleton
  return (
    <div className="fixed inset-0 z-[100] bg-[var(--color-bg)] p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-6 w-56 rounded-md bg-[var(--color-border)] animate-pulse" />
        <div className="h-4 w-80 rounded-md bg-[var(--color-border)] animate-pulse" />
        <div className="grid grid-cols-3 gap-4 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-[var(--color-border)] animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-[var(--color-border)] animate-pulse" />
      </div>
    </div>
  )
}

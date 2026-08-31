import { usePlatformSettings } from '../../theme/PlatformSettingsContext'

// Full-screen centered card layout shared by Login, Forgot Password, and Reset Password.
export default function AuthLayout({ title, subtitle, children, footer }) {
  const { logoUrl, generalSettings } = usePlatformSettings()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logoUrl} alt="Platform logo" className="w-12 h-12 rounded-lg object-cover mb-3" />
          <span className="font-semibold text-[var(--color-text)] text-center">
            {generalSettings.platformName}
          </span>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 sm:p-8">
          <h1 className="text-lg font-semibold text-[var(--color-text)] mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--color-text-muted)] mb-6">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="mt-5 text-center text-sm text-[var(--color-text-muted)]">{footer}</div>}
      </div>
    </div>
  )
}

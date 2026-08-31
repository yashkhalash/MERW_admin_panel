import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { usePlatformSettings } from '../../theme/PlatformSettingsContext'
import ConfirmDialog from './ConfirmDialog'
import { useToast } from './ToastContext'
import { navItems } from './navItems'
import { LogOut, X } from 'lucide-react'

function SidebarContent({ onNavigate, onCloseClick }) {
  const { logoUrl, generalSettings } = usePlatformSettings()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = () => {
    // TODO: replace with real API call — POST /api/v1/auth/logout, then clear session and redirect to login
    setLoggingOut(false)
    onNavigate?.()
    showToast('You have been logged out.')
    navigate('/login')
  }

  return (
    <>
      <div className="h-16 flex items-center gap-2 px-5 border-b border-[var(--color-border)] shrink-0">
        <img src={logoUrl} alt="Platform logo" className="w-8 h-8 rounded-md object-cover shrink-0" />
        <span className="font-semibold text-[var(--color-text)] text-sm leading-tight truncate flex-1">
          {generalSettings.platformName}
        </span>
        {onCloseClick && (
          <button
            onClick={onCloseClick}
            className="md:hidden p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-3 border-t border-[var(--color-border)] shrink-0">
        <button
          onClick={() => setLoggingOut(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
        >
          <LogOut size={17} strokeWidth={2} className="shrink-0" />
          Logout
        </button>
      </div>

      <ConfirmDialog
        open={loggingOut}
        onClose={() => setLoggingOut(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out of the admin console?"
        confirmLabel="Logout"
        danger
      />
    </>
  )
}

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  return (
    <>
      {/* Desktop: static sidebar, always visible at md+ */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[var(--color-border)] bg-[var(--color-surface)]">
        <SidebarContent />
      </aside>

      {/* Mobile: overlay drawer, toggled via the Topbar hamburger button */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-[var(--color-surface)] shadow-xl transition-transform duration-200 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent onNavigate={onClose} onCloseClick={onClose} />
        </aside>
      </div>
    </>
  )
}

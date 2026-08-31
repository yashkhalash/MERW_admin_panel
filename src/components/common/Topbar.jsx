import { useState } from 'react'
import { Bell, ChevronDown, LogOut, UserCircle, Menu, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '../../modules/my-profile/ProfileContext'
import { useToast } from './ToastContext'
import ConfirmDialog from './ConfirmDialog'
import NotificationPanel from './NotificationPanel'
import GlobalSearch from './GlobalSearch'
import { notifications as mockNotifications } from '../../mock-data/notifications'
// TODO: replace mock data with real API call to /api/v1/notifications

function getInitials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Topbar({ onMenuClick = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const { profile } = useProfile()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    // TODO: replace with real API call — POST /api/v1/auth/logout, then clear session and redirect to login
    setLoggingOut(false)
    setMenuOpen(false)
    showToast('You have been logged out.')
    navigate('/login')
  }

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    showToast('All notifications marked as read.')
  }

  return (
    <header className="h-16 sticky top-0 z-10 flex items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <GlobalSearch />

      <div className="flex items-center gap-1 sm:gap-3 ml-auto">
        <Link
          to="/settings"
          className="p-2 rounded-md hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={18} />
        </Link>

        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 rounded-md hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-1 sm:pr-2 py-1 rounded-md hover:bg-[var(--color-bg)]"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {getInitials(profile.name)}
              </div>
            )}
            <span className="text-sm font-medium text-[var(--color-text)] hidden sm:inline">
              {profile.name}
            </span>
            <ChevronDown size={14} className="text-[var(--color-text-muted)] hidden sm:inline" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg py-1 z-20">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              >
                <UserCircle size={16} /> My Profile
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setLoggingOut(true)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
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

      <NotificationPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkRead}
      />
    </header>
  )
}

import { createPortal } from 'react-dom'
import { X, Bell, CheckCheck } from 'lucide-react'

// Right-side slide-over panel for notifications, opened from the Topbar bell icon.
export default function NotificationPanel({ open, onClose, notifications, onMarkAllRead, onMarkRead }) {
  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className={`absolute inset-y-0 right-0 w-full sm:w-96 max-w-full flex flex-col bg-[var(--color-surface)] shadow-xl transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between gap-2 px-5 border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-base font-semibold text-[var(--color-text)]">Notifications</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-2">
              <Bell size={28} className="text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">You're all caught up.</p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => onMarkRead(n.id)}
                  className={`px-5 py-3.5 border-b border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-bg)] ${
                    !n.read ? 'bg-[var(--color-primary)]/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />}
                    <div className={n.read ? 'pl-4' : ''}>
                      <p className="text-sm font-medium text-[var(--color-text)]">{n.title}</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{n.message}</p>
                      <span className="text-xs text-[var(--color-text-muted)] mt-1 block">{n.time}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>,
    document.body
  )
}

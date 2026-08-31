import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../components/common/ToastContext'
import ProfileInfoTab from './ProfileInfoTab'
import ChangePasswordTab from './ChangePasswordTab'

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'password', label: 'Change Password' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleLogout = () => {
    // TODO: replace with real API call — POST /api/v1/auth/logout, then clear session and redirect to login
    setLoggingOut(false)
    showToast('You have been logged out.')
    navigate('/login')
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your admin account details"
        actions={
          <button
            onClick={() => setLoggingOut(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
          >
            <LogOut size={15} /> Logout
          </button>
        }
      />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' && <ProfileInfoTab />}
      {activeTab === 'password' && <ChangePasswordTab />}

      <ConfirmDialog
        open={loggingOut}
        onClose={() => setLoggingOut(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Are you sure you want to log out of the admin console?"
        confirmLabel="Logout"
        danger
      />
    </div>
  )
}

import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import PaletteSelector from '../../components/common/PaletteSelector'
import ToastPositionSettings from '../../components/common/ToastPositionSettings'

const TABS = [
  { key: 'appearance', label: 'Appearance' },
  { key: 'notifications', label: 'Toast Notifications' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Quick access to appearance and notification preferences" />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      <div key={activeTab} style={{ animation: 'fadeInUp 0.25s ease-out both' }}>
        {activeTab === 'appearance' && <PaletteSelector />}
        {activeTab === 'notifications' && <ToastPositionSettings />}
      </div>
    </div>
  )
}

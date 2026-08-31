import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import GeneralSettingsTab from './GeneralSettingsTab'
import ErpIntegrationTab from './ErpIntegrationTab'
import PaymentGatewayTab from './PaymentGatewayTab'
// Appearance settings live under /settings now (Topbar gear icon), not here.

const TABS = [
  { key: 'general', label: 'General Settings' },
  { key: 'erp', label: 'ERP Integration' },
  { key: 'payment', label: 'Payment Gateway' },
]

export default function PlatformConfigurationPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div>
      <PageHeader
        title="Platform Configuration"
        subtitle="Configure general and integration settings"
      />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && <GeneralSettingsTab />}
      {activeTab === 'erp' && <ErpIntegrationTab />}
      {activeTab === 'payment' && <PaymentGatewayTab />}
    </div>
  )
}

import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import SalesReportsTab from './SalesReportsTab'
import MarketplaceAnalyticsTab from './MarketplaceAnalyticsTab'
import UserActivityTab from './UserActivityTab'
import ProductPerformanceTab from './ProductPerformanceTab'

const TABS = [
  { key: 'sales', label: 'Sales Reports' },
  { key: 'marketplace', label: 'Marketplace Analytics' },
  { key: 'activity', label: 'User Activity' },
  { key: 'products', label: 'Product Performance' },
]

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('sales')

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Insights across sales, marketplace growth, user activity, and product performance"
      />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'sales' && <SalesReportsTab />}
      {activeTab === 'marketplace' && <MarketplaceAnalyticsTab />}
      {activeTab === 'activity' && <UserActivityTab />}
      {activeTab === 'products' && <ProductPerformanceTab />}
    </div>
  )
}

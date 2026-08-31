import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import CommissionConfigTab from './CommissionConfigTab'
import FinancialReportsTab from './FinancialReportsTab'
import SettlementBatchesTab from './SettlementBatchesTab'
import TransactionLedgerTab from './TransactionLedgerTab'
import RefundManagementTab from './RefundManagementTab'

const TABS = [
  { key: 'commission', label: 'Commission Config' },
  { key: 'reports', label: 'Financial Reports' },
  { key: 'settlements', label: 'Settlement Batches' },
  { key: 'ledger', label: 'Transaction Ledger' },
  { key: 'refunds', label: 'Refund Management' },
]

export default function FinancialSettlementPage() {
  const [activeTab, setActiveTab] = useState('commission')

  return (
    <div>
      <PageHeader
        title="Financial & Settlement Management"
        subtitle="Manage commissions, settlements, transactions, and refunds"
      />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'commission' && <CommissionConfigTab />}
      {activeTab === 'reports' && <FinancialReportsTab />}
      {activeTab === 'settlements' && <SettlementBatchesTab />}
      {activeTab === 'ledger' && <TransactionLedgerTab />}
      {activeTab === 'refunds' && <RefundManagementTab />}
    </div>
  )
}

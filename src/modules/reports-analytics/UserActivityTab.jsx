import { useMemo, useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import DataTable from '../../components/common/DataTable'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import { userActivityTrend, userActivityLog } from '../../mock-data/reports'
// TODO: replace mock data with real API call to /api/v1/reports/user-activity

export default function UserActivityTab() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ role: '' })

  const filteredLog = useMemo(() => {
    return userActivityLog.filter((a) => {
      const matchesSearch = !search || a.user.toLowerCase().includes(search.toLowerCase())
      const matchesRole = !filters.role || a.role === filters.role
      return matchesSearch && matchesRole
    })
  }, [search, filters])

  const columns = useMemo(
    () => [
      { header: 'User', accessorKey: 'user' },
      { header: 'Role', accessorKey: 'role' },
      { header: 'Action', accessorKey: 'action' },
      { header: 'Timestamp', accessorKey: 'timestamp' },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Daily Active Users &amp; Sessions</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Last 7 days</p>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={userActivityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="sessions" name="Sessions" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} barSize={26} />
            <Line type="monotone" dataKey="dau" name="Daily Active Users" stroke="var(--color-primary)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by user name..." />
          <FilterBar
            filters={[
              {
                key: 'role',
                label: 'Role',
                options: ['Customer', 'Seller', 'Courier'].map((v) => ({ label: v, value: v })),
              },
            ]}
            values={filters}
            onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          />
        </div>
        <DataTable columns={columns} data={filteredLog} pageSize={10} />
      </div>
    </div>
  )
}

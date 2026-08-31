import { useMemo, useState } from 'react'
import { Pencil, UserPlus, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import DataTable from '../../components/common/DataTable'
import RoleFormModal from './RoleFormModal'
import AssignRoleModal from './AssignRoleModal'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import DateRangePicker from '../../components/common/DateRangePicker'
import { useToast } from '../../components/common/ToastContext'
import { roles as mockRoles } from '../../mock-data/roles'
// TODO: replace mock data with real API call to /api/v1/roles

export default function RoleListPage() {
  const { showToast } = useToast()
  const [roles, setRoles] = useState(mockRoles)
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [formState, setFormState] = useState(null) // { role: null | role }
  const [assignTarget, setAssignTarget] = useState(null) // role

  const filteredData = useMemo(
    () =>
      roles.filter((r) => {
        const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
        const matchesStart = !dateRange.start || r.createdDate >= dateRange.start
        const matchesEnd = !dateRange.end || r.createdDate <= dateRange.end
        return matchesSearch && matchesStart && matchesEnd
      }),
    [roles, search, dateRange]
  )

  const handleSaveRole = (data) => {
    if (formState.role) {
      setRoles((prev) => prev.map((r) => (r.id === formState.role.id ? { ...r, ...data } : r)))
      showToast(`${data.name} role has been updated.`)
    } else {
      const newRole = {
        ...data,
        id: `ROLE-${roles.length + 1 + Math.floor(Math.random() * 1000)}`,
        usersCount: 0,
        createdDate: new Date().toISOString().slice(0, 10),
      }
      setRoles((prev) => [newRole, ...prev])
      showToast(`${data.name} role has been created.`)
    }
    setFormState(null)
  }

  const handleAssign = (user) => {
    showToast(`${user.name} has been assigned the ${assignTarget.name} role.`)
    setRoles((prev) =>
      prev.map((r) => (r.id === assignTarget.id ? { ...r, usersCount: r.usersCount + 1 } : r))
    )
    setAssignTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Role Name', accessorKey: 'name' },
      { header: 'Description', accessorKey: 'description' },
      { header: 'Users', accessorKey: 'usersCount' },
      { header: 'Created Date', accessorKey: 'createdDate' },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const r = row.original
          return (
            <div className="flex items-center gap-1">
              <IconActionButton icon={Pencil} label="Edit" variant="edit" onClick={() => setFormState({ role: r })} />
              <IconActionButton icon={UserPlus} label="Assign Role" variant="assign" onClick={() => setAssignTarget(r)} />
            </div>
          )
        },
      },
    ],
    []
  )

  const activeFilters = [
    search && `Search: "${search}"`,
    dateRange.start && `From: ${dateRange.start}`,
    dateRange.end && `To: ${dateRange.end}`,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Role & Permission Management"
        subtitle="Define admin roles and control module-level access"
        actions={
          <div className="flex items-center gap-2">
            <ExportCsvButton
              data={filteredData}
              filename="roles"
              title="Role & Permission Management"
              filters={activeFilters}
              columns={[
                { label: 'Role Name', accessor: 'name' },
                { label: 'Description', accessor: 'description' },
                { label: 'Users', accessor: 'usersCount' },
                { label: 'Created Date', accessor: 'createdDate' },
              ]}
            />
            <button
              onClick={() => setFormState({ role: null })}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              <Plus size={15} /> Add Role
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by role name..." />
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
          placeholder="Created date range"
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <RoleFormModal
        open={!!formState}
        onClose={() => setFormState(null)}
        onSave={handleSaveRole}
        role={formState?.role}
      />

      <AssignRoleModal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        onSave={handleAssign}
        role={assignTarget}
      />
    </div>
  )
}

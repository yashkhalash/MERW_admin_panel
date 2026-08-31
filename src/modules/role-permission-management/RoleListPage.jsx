import { useMemo, useState } from 'react'
import { Pencil, UserPlus, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import DataTable from '../../components/common/DataTable'
import RoleFormModal from './RoleFormModal'
import AssignRoleModal from './AssignRoleModal'
import { useToast } from '../../components/common/ToastContext'
import { roles as mockRoles } from '../../mock-data/roles'
// TODO: replace mock data with real API call to /api/v1/roles

export default function RoleListPage() {
  const { showToast } = useToast()
  const [roles, setRoles] = useState(mockRoles)
  const [search, setSearch] = useState('')
  const [formState, setFormState] = useState(null) // { role: null | role }
  const [assignTarget, setAssignTarget] = useState(null) // role

  const filteredData = useMemo(
    () => roles.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
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
              <button
                onClick={() => setFormState({ role: r })}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setAssignTarget(r)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="Assign Role"
              >
                <UserPlus size={16} />
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Role & Permission Management"
        subtitle="Define admin roles and control module-level access"
        actions={
          <button
            onClick={() => setFormState({ role: null })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            <Plus size={15} /> Add Role
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by role name..." />
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

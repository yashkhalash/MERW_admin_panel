import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, Pencil, Ban, CheckCircle2, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CourierFormModal from './CourierFormModal'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import { useToast } from '../../components/common/ToastContext'
import { couriers as mockCouriers } from '../../mock-data/couriers'
// TODO: replace mock data with real API call to /api/v1/couriers

export default function CourierListPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const [couriers, setCouriers] = useState(mockCouriers)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    zone: searchParams.get('zone') || '',
    status: searchParams.get('status') || '',
  })
  const [confirmTarget, setConfirmTarget] = useState(null) // { courier, action: 'suspend'|'reactivate' }
  const [formState, setFormState] = useState(null) // { courier: null | courier }

  const zones = useMemo(() => [...new Set(mockCouriers.map((c) => c.zone))], [])

  const filteredData = useMemo(() => {
    return couriers.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)
      const matchesZone = !filters.zone || c.zone === filters.zone
      const matchesStatus = !filters.status || c.status === filters.status
      return matchesSearch && matchesZone && matchesStatus
    })
  }, [couriers, search, filters])

  const handleConfirmAction = (reason) => {
    const { courier, action } = confirmTarget
    setCouriers((prev) =>
      prev.map((c) =>
        c.id === courier.id
          ? {
              ...c,
              status: action === 'suspend' ? 'Suspended' : 'Active',
              suspendReason: action === 'suspend' ? reason : null,
            }
          : c
      )
    )
    showToast(
      action === 'suspend' ? `${courier.name} has been suspended.` : `${courier.name} has been reactivated.`,
      action === 'suspend' ? 'error' : 'success'
    )
    setConfirmTarget(null)
  }

  const handleSaveCourier = (data) => {
    if (formState.courier) {
      setCouriers((prev) =>
        prev.map((c) => (c.id === formState.courier.id ? { ...c, ...data } : c))
      )
      showToast(`${data.name}'s details have been updated.`)
    } else {
      const newCourier = {
        ...data,
        id: `CRR-${3000 + couriers.length + Math.floor(Math.random() * 1000)}`,
        status: 'Active',
        joinedDate: new Date().toISOString().slice(0, 10),
        deliveriesCompleted: 0,
        suspendReason: null,
      }
      setCouriers((prev) => [newCourier, ...prev])
      showToast(`${data.name} has been added as a courier.`)
    }
    setFormState(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Employee ID', accessorKey: 'employeeId' },
      { header: 'Mobile', accessorKey: 'mobile', enableSorting: false },
      { header: 'Vehicle Type', accessorKey: 'vehicleType' },
      { header: 'Zone', accessorKey: 'zone' },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const c = row.original
          return (
            <div className="flex items-center gap-1">
              <IconActionButton icon={Eye} label="View" variant="view" onClick={() => navigate(`/couriers/${c.id}`)} />
              <IconActionButton icon={Pencil} label="Edit" variant="edit" onClick={() => setFormState({ courier: c })} />
              {c.status === 'Active' ? (
                <IconActionButton
                  icon={Ban}
                  label="Suspend"
                  variant="suspend"
                  onClick={() => setConfirmTarget({ courier: c, action: 'suspend' })}
                />
              ) : (
                <IconActionButton
                  icon={CheckCircle2}
                  label="Reactivate"
                  variant="reactivate"
                  onClick={() => setConfirmTarget({ courier: c, action: 'reactivate' })}
                />
              )}
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  const activeFilters = [
    search && `Search: "${search}"`,
    filters.zone && `Zone: ${filters.zone}`,
    filters.status && `Status: ${filters.status}`,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Courier Management"
        subtitle="Manage delivery couriers, zones, and availability"
        actions={
          <div className="flex items-center gap-2">
            <ExportCsvButton
              data={filteredData}
              filename="couriers"
              title="Courier Management"
              filters={activeFilters}
              columns={[
                { label: 'Name', accessor: 'name' },
                { label: 'Employee ID', accessor: 'employeeId' },
                { label: 'Mobile', accessor: 'mobile' },
                { label: 'Vehicle Type', accessor: 'vehicleType' },
                { label: 'Zone', accessor: 'zone' },
                { label: 'Status', accessor: 'status' },
              ]}
            />
            <button
              onClick={() => setFormState({ courier: null })}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              <Plus size={15} /> Add Courier
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, employee ID, mobile..." />
        <FilterBar
          filters={[
            { key: 'zone', label: 'Zone', options: zones.map((z) => ({ label: z, value: z })) },
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'Suspended', value: 'Suspended' },
              ],
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <CourierFormModal
        open={!!formState}
        onClose={() => setFormState(null)}
        onSave={handleSaveCourier}
        courier={formState?.courier}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmAction}
        title={confirmTarget?.action === 'suspend' ? 'Suspend Courier' : 'Reactivate Courier'}
        message={
          confirmTarget?.action === 'suspend'
            ? `This will suspend ${confirmTarget?.courier.name} and unassign them from active deliveries. Please provide a reason.`
            : `This will reactivate ${confirmTarget?.courier.name}, allowing new delivery assignments.`
        }
        confirmLabel={confirmTarget?.action === 'suspend' ? 'Suspend' : 'Reactivate'}
        danger={confirmTarget?.action === 'suspend'}
        requireReason={confirmTarget?.action === 'suspend'}
      />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useCmsPages } from './CmsPagesContext'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock data with real API call to /api/v1/cms/pages

export default function CmsListPage() {
  const navigate = useNavigate()
  const { pages, deletePage } = useCmsPages()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredData = useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !filters.status || p.status === filters.status
      return matchesSearch && matchesStatus
    })
  }, [pages, search, filters])

  const handleDelete = () => {
    deletePage(deleteTarget.id)
    showToast(`"${deleteTarget.title}" has been deleted.`, 'error')
    setDeleteTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Title', accessorKey: 'title' },
      { header: 'Slug', accessorKey: 'slug', enableSorting: false },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      { header: 'Last Updated', accessorKey: 'updatedDate' },
      { header: 'Author', accessorKey: 'author' },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/cms/${p.id}`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="View"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => navigate(`/cms/${p.id}/edit`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(p)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-danger)]"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  return (
    <div>
      <PageHeader
        title="CMS Management"
        subtitle="Manage static content pages shown on the marketplace"
        actions={
          <button
            onClick={() => navigate('/cms/new')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            <Plus size={15} /> Add Page
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by page title..." />
        <FilterBar
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: ['Published', 'Draft'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Page"
        message={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

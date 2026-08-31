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
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
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
              <IconActionButton icon={Eye} label="View" variant="view" onClick={() => navigate(`/cms/${p.id}`)} />
              <IconActionButton icon={Pencil} label="Edit" variant="edit" onClick={() => navigate(`/cms/${p.id}/edit`)} />
              <IconActionButton icon={Trash2} label="Delete" variant="delete" onClick={() => setDeleteTarget(p)} />
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
          <div className="flex items-center gap-2">
            <ExportCsvButton
              data={filteredData}
              filename="cms-pages"
              columns={[
                { label: 'Title', accessor: 'title' },
                { label: 'Slug', accessor: 'slug' },
                { label: 'Status', accessor: 'status' },
                { label: 'Last Updated', accessor: 'updatedDate' },
                { label: 'Author', accessor: 'author' },
              ]}
            />
            <button
              onClick={() => navigate('/cms/new')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              <Plus size={15} /> Add Page
            </button>
          </div>
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

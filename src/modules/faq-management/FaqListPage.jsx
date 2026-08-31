import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FaqFormModal from './FaqFormModal'
import { useFaqs } from './FaqsContext'
import { useToast } from '../../components/common/ToastContext'
import { FAQ_CATEGORIES } from '../../mock-data/faqs'
// TODO: replace mock data with real API call to /api/v1/faqs

export default function FaqListPage() {
  const navigate = useNavigate()
  const { faqs, addFaq, updateFaq, deleteFaq } = useFaqs()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: '', status: '' })
  const [formState, setFormState] = useState(null) // { faq: null | faq }
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredData = useMemo(() => {
    return faqs.filter((f) => {
      const matchesSearch = !search || f.question.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !filters.category || f.category === filters.category
      const matchesStatus = !filters.status || f.status === filters.status
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [faqs, search, filters])

  const handleSave = (data) => {
    if (formState.faq) {
      updateFaq(formState.faq.id, data)
      showToast('FAQ has been updated.')
    } else {
      addFaq(data)
      showToast('FAQ has been added.')
    }
    setFormState(null)
  }

  const handleDelete = () => {
    deleteFaq(deleteTarget.id)
    showToast('FAQ has been deleted.', 'error')
    setDeleteTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Question', accessorKey: 'question' },
      { header: 'Category', accessorKey: 'category' },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      { header: 'Last Updated', accessorKey: 'updatedDate' },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/faqs/${f.id}`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="View"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => setFormState({ faq: f })}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(f)}
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
        title="FAQ Management"
        subtitle="Manage frequently asked questions shown to customers and sellers"
        actions={
          <button
            onClick={() => setFormState({ faq: null })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            <Plus size={15} /> Add FAQ
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by question..." />
        <FilterBar
          filters={[
            {
              key: 'category',
              label: 'Category',
              options: FAQ_CATEGORIES.map((c) => ({ label: c, value: c })),
            },
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

      <FaqFormModal
        open={!!formState}
        onClose={() => setFormState(null)}
        onSave={handleSave}
        faq={formState?.faq}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        message={`This will permanently delete "${deleteTarget?.question}". This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

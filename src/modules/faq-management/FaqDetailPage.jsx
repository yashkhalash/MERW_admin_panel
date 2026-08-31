import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FaqFormModal from './FaqFormModal'
import { useFaqs } from './FaqsContext'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock data with real API call to /api/v1/faqs/:id

export default function FaqDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getFaq, updateFaq, deleteFaq } = useFaqs()
  const { showToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const faq = getFaq(id)

  if (!faq) {
    return (
      <div>
        <PageHeader title="FAQ Not Found" />
        <Link to="/faqs" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to FAQ Management
        </Link>
      </div>
    )
  }

  const handleSave = (data) => {
    updateFaq(faq.id, data)
    showToast('FAQ has been updated.')
    setEditing(false)
  }

  const handleDelete = () => {
    deleteFaq(faq.id)
    showToast('FAQ has been deleted.', 'error')
    navigate('/faqs')
  }

  return (
    <div>
      <button
        onClick={() => navigate('/faqs')}
        className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-3"
      >
        <ArrowLeft size={15} /> Back to FAQ Management
      </button>

      <PageHeader
        title={faq.question}
        subtitle={faq.category}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              <Pencil size={15} /> Edit
            </button>
            <button
              onClick={() => setDeleting(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-danger)] text-white hover:opacity-90"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        }
      />

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={faq.status} />
          <span className="text-xs text-[var(--color-text-muted)]">Last updated {faq.updatedDate}</span>
        </div>
        <p className="text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-line">{faq.answer}</p>
      </div>

      <FaqFormModal open={editing} onClose={() => setEditing(false)} onSave={handleSave} faq={faq} />

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        message={`This will permanently delete "${faq.question}". This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

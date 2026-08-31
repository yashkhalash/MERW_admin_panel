import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useCmsPages } from './CmsPagesContext'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock data with real API call to /api/v1/cms/pages/:id

export default function CmsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPage, deletePage } = useCmsPages()
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const page = getPage(id)

  if (!page) {
    return (
      <div>
        <PageHeader title="Page Not Found" />
        <Link to="/cms" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to CMS Management
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    deletePage(page.id)
    showToast(`"${page.title}" has been deleted.`, 'error')
    navigate('/cms')
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'CMS Management', to: '/cms' },
          { label: page.title },
        ]}
      />

      <PageHeader
        title={page.title}
        subtitle={`/${page.slug}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/cms/${page.id}/edit`)}
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
          <StatusBadge status={page.status} />
          <span className="text-xs text-[var(--color-text-muted)]">
            Last updated {page.updatedDate} by {page.author}
          </span>
        </div>
        <div className="text-sm text-[var(--color-text)] leading-relaxed" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={handleDelete}
        title="Delete Page"
        message={`This will permanently delete "${page.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}

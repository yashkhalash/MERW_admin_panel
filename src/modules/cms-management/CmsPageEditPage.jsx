import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Globe,
  Settings,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Quote,
  Code2,
  List,
  ListOrdered,
  Type,
  Paintbrush,
  Eye,
  Code,
} from 'lucide-react'
import { useCmsPages } from './CmsPagesContext'
import { useToast } from '../../components/common/ToastContext'
import Select from '../../components/common/Select'
// TODO: replace mock data with real API call to /api/v1/cms/pages

const FONT_FAMILIES = ['Default Font', 'Serif', 'Sans-serif', 'Monospace']
const FONT_SIZES = ['16px', '18px', '20px (default)', '24px', '28px']
const META_TITLE_LIMIT = 60
const META_DESC_LIMIT = 160

const toolbarButtons = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: LinkIcon, label: 'Link' },
  { icon: ImageIcon, label: 'Image' },
  { icon: TableIcon, label: 'Table' },
  { icon: Quote, label: 'Quote' },
  { icon: Code2, label: 'Code' },
  { icon: List, label: 'Bullet list' },
  { icon: ListOrdered, label: 'Numbered list' },
]

export default function CmsPageEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPage, addPage, updatePage } = useCmsPages()
  const { showToast } = useToast()
  const isEdit = !!id
  const existingPage = useMemo(() => (isEdit ? getPage(id) : null), [id, isEdit, getPage])

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [status, setStatus] = useState('Draft')
  const [content, setContent] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0])
  const [fontSize, setFontSize] = useState(FONT_SIZES[2])
  const [customCssOpen, setCustomCssOpen] = useState(false)
  const [customCss, setCustomCss] = useState('')
  const [descMode, setDescMode] = useState('html') // 'html' | 'preview'
  const [blockFormat, setBlockFormat] = useState('Paragraph')
  const [bodyFontFamily, setBodyFontFamily] = useState(FONT_FAMILIES[0])

  useEffect(() => {
    if (isEdit && existingPage) {
      setTitle(existingPage.title)
      setSlug(existingPage.slug)
      setStatus(existingPage.status)
      setContent(existingPage.content)
      setMetaTitle(existingPage.metaTitle || '')
      setMetaDescription(existingPage.metaDescription || '')
      setSlugTouched(true)
    }
  }, [isEdit, existingPage])

  useEffect(() => {
    if (!isEdit && !slugTouched) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    }
  }, [title, isEdit, slugTouched])

  if (isEdit && !existingPage) {
    return (
      <div>
        <p className="text-sm text-[var(--color-text-muted)]">Page not found.</p>
      </div>
    )
  }

  const isValid = title.trim().length > 0 && slug.trim().length > 0 && content.trim().length > 0

  const handleSave = () => {
    const data = { title, slug, status, content, metaTitle, metaDescription }
    if (isEdit) {
      updatePage(id, data)
      showToast(`"${title}" has been updated.`)
      navigate(`/cms/${id}`)
    } else {
      const created = addPage(data)
      showToast(`"${title}" has been created.`)
      navigate(`/cms/${created.id}`)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-bg)] shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)]">
              {isEdit ? 'Edit CMS Page' : 'Create CMS Page'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              {isEdit ? 'Update this page\'s structure and content.' : 'Set up your new page structure'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-success)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={15} /> Save Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[var(--color-text)]">
                Title <span className="text-[var(--color-danger)]">*</span>
              </label>
              <span className="text-xs text-[var(--color-text-muted)]">Main header of the page</span>
            </div>
            <div className="border border-[var(--color-border)] rounded-md overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                <Select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  options={FONT_FAMILIES}
                  className="text-xs rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                />
                <Select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  options={FONT_SIZES}
                  className="text-xs rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => setCustomCssOpen((v) => !v)}
                  className="flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline"
                >
                  <Paintbrush size={12} /> Custom CSS
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Terms and Conditions"
                style={{
                  fontSize: fontSize.includes('default') ? '20px' : fontSize,
                  fontFamily:
                    fontFamily === 'Serif' ? 'serif' : fontFamily === 'Monospace' ? 'monospace' : undefined,
                }}
                className="w-full px-3 py-3 text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none"
              />
              {customCssOpen && (
                <textarea
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  rows={2}
                  placeholder="e.g. color: #1A1A1A; letter-spacing: 0.02em;"
                  className="w-full px-3 py-2 text-xs font-mono border-t border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Description / content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[var(--color-text)]">
                Description <span className="text-[var(--color-danger)]">*</span>
              </label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setDescMode('html')}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    descMode === 'html'
                      ? 'text-[var(--color-primary-dark)] font-medium'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  <Code size={13} /> HTML Editor
                </button>
                <button
                  type="button"
                  onClick={() => setDescMode('preview')}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    descMode === 'preview'
                      ? 'text-[var(--color-primary-dark)] font-medium'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  <Eye size={13} /> Visual Preview
                </button>
              </div>
            </div>

            <div className="border border-[var(--color-border)] rounded-md overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                <button type="button" className="p-1 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">
                  <Undo2 size={14} />
                </button>
                <button type="button" className="p-1 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">
                  <Redo2 size={14} />
                </button>
                <span className="w-px h-4 bg-[var(--color-border)]" />
                <Select
                  value={blockFormat}
                  onChange={(e) => setBlockFormat(e.target.value)}
                  options={['Paragraph', 'Heading 1', 'Heading 2']}
                  className="text-xs rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                />
                <span className="w-px h-4 bg-[var(--color-border)]" />
                {toolbarButtons.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    className="p-1 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
                  >
                    <Icon size={14} />
                  </button>
                ))}
                <span className="w-px h-4 bg-[var(--color-border)]" />
                <button type="button" className="p-1 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">
                  <Type size={14} />
                </button>
                <Select
                  value={bodyFontFamily}
                  onChange={(e) => setBodyFontFamily(e.target.value)}
                  options={FONT_FAMILIES}
                  className="text-xs rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                />
              </div>

              {descMode === 'html' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder="<p>Welcome to our site...</p>"
                  className="w-full px-4 py-3 text-sm font-mono text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none resize-y"
                />
              ) : (
                <div
                  className="min-h-[280px] px-4 py-3 text-sm text-[var(--color-text)] prose-sm"
                  dangerouslySetInnerHTML={{ __html: content || '<p class="text-[var(--color-text-muted)]">Nothing to preview yet.</p>' }}
                />
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5 text-xs text-[var(--color-text-muted)]">
              <span>Double check HTML brackets to avoid parsing issues.</span>
              <span>Characters: {content.length}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-4">
              <Globe size={16} /> Page Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] tracking-wide mb-1.5">
                  SLUG URL <span className="text-[var(--color-danger)]">*</span>
                </label>
                <div className="flex items-center rounded-md border border-[var(--color-border)] overflow-hidden">
                  <span className="px-2.5 py-2 text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border-r border-[var(--color-border)]">
                    /
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setSlugTouched(true)
                    }}
                    placeholder="e.g. privacy-policy"
                    className="flex-1 px-2.5 py-2 text-sm text-[var(--color-text)] focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Auto-generated from title but can be overridden. Keep URL-friendly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] tracking-wide mb-1.5">
                  PUBLICATION STATUS
                </label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={['Draft', 'Published']}
                  className="w-full text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-4">
              <Settings size={16} /> Search Engine Optimization (SEO)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] tracking-wide">
                    META TITLE
                  </label>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {metaTitle.length}/{META_TITLE_LIMIT}
                  </span>
                </div>
                <input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value.slice(0, META_TITLE_LIMIT))}
                  placeholder="Search engine title..."
                  className="w-full text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] tracking-wide">
                    META DESCRIPTION
                  </label>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {metaDescription.length}/{META_DESC_LIMIT}
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value.slice(0, META_DESC_LIMIT))}
                  rows={3}
                  placeholder="Brief description of the page context for Google searches..."
                  className="w-full text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

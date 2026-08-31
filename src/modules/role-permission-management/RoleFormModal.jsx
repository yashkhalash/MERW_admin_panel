import { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import { PERMISSION_MODULES, PERMISSION_ACTIONS } from '../../mock-data/roles'

function emptyPermissions() {
  return PERMISSION_MODULES.reduce((acc, m) => {
    acc[m.key] = { view: false, create: false, edit: false, delete: false }
    return acc
  }, {})
}

export default function RoleFormModal({ open, onClose, onSave, role }) {
  const isEdit = !!role
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState(emptyPermissions())

  useEffect(() => {
    if (open) {
      setName(role?.name ?? '')
      setDescription(role?.description ?? '')
      setPermissions(role?.permissions ?? emptyPermissions())
    }
  }, [open, role])

  const canSave = name.trim().length > 0 && description.trim().length > 0

  const togglePermission = (moduleKey, action) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: { ...prev[moduleKey], [action]: !prev[moduleKey][action] },
    }))
  }

  const toggleModuleAll = (moduleKey, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: { view: checked, create: checked, edit: checked, delete: checked },
    }))
  }

  const handleSave = () => {
    onSave({ name: name.trim(), description: description.trim(), permissions })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Role' : 'Add Role'}
      size="xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save Changes' : 'Add Role'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Role Name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldInputClass}
              placeholder="e.g. Operations Manager"
            />
          </FormField>
          <FormField label="Description" required>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={fieldInputClass}
              placeholder="Short description of this role's responsibilities"
            />
          </FormField>
        </div>

        <div>
          <span className="block text-xs font-medium text-[var(--color-text)] mb-2">
            Module Permissions
          </span>
          <div className="border border-[var(--color-border)] rounded-md overflow-hidden">
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[var(--color-bg)]">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-[var(--color-text-muted)]">Module</th>
                    {PERMISSION_ACTIONS.map((action) => (
                      <th
                        key={action}
                        className="text-center px-3 py-2.5 font-medium text-[var(--color-text-muted)] capitalize"
                      >
                        {action}
                      </th>
                    ))}
                    <th className="text-center px-3 py-2.5 font-medium text-[var(--color-text-muted)]">All</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_MODULES.map((m) => {
                    const perms = permissions[m.key] || { view: false, create: false, edit: false, delete: false }
                    const allChecked = PERMISSION_ACTIONS.every((a) => perms[a])
                    return (
                      <tr key={m.key} className="border-t border-[var(--color-border)]">
                        <td className="px-4 py-2 text-[var(--color-text)] whitespace-nowrap">{m.label}</td>
                        {PERMISSION_ACTIONS.map((action) => (
                          <td key={action} className="text-center px-3 py-2">
                            <input
                              type="checkbox"
                              checked={!!perms[action]}
                              onChange={() => togglePermission(m.key, action)}
                              className="w-4 h-4 accent-[var(--color-primary)]"
                            />
                          </td>
                        ))}
                        <td className="text-center px-3 py-2">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(e) => toggleModuleAll(m.key, e.target.checked)}
                            className="w-4 h-4 accent-[var(--color-primary)]"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

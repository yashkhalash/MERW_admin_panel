import { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import { assignableUsers } from '../../mock-data/roles'
// TODO: replace mock data with real API call to /api/v1/users?assignable=true

export default function AssignRoleModal({ open, onClose, onSave, role }) {
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (open) setUserId('')
  }, [open])

  const canSave = !!userId

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assign Role - ${role?.name ?? ''}`}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(assignableUsers.find((u) => u.id === userId))}
            disabled={!canSave}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Assign
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Select a user to assign the <span className="font-medium text-[var(--color-text)]">{role?.name}</span> role to.
      </p>
      <FormField label="User" required>
        <Select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Select a user..."
          options={assignableUsers.map((u) => ({
            value: u.id,
            label: `${u.name} (${u.email}) · currently ${u.currentRole}`,
          }))}
          className={fieldInputClass}
        />
      </FormField>
    </Modal>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import { useToast } from '../../components/common/ToastContext'
import { commissionConfig as mockCommissionConfig } from '../../mock-data/financial'
// TODO: replace mock data with real API call to /api/v1/financial/commission-config

function EditCommissionModal({ open, onClose, onSave, item }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  useEffect(() => {
    if (item) reset({ rate: item.rate })
  }, [item, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Commission - ${item?.category ?? ''}`}
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
            onClick={handleSubmit((data) => onSave(Number(data.rate)))}
            disabled={!isValid}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </>
      }
    >
      <FormField label="Commission Rate (%)" required error={errors.rate?.message}>
        <input
          type="number"
          step="0.1"
          defaultValue={item?.rate}
          className={fieldInputClass}
          {...register('rate', {
            required: 'Rate is required',
            min: { value: 0, message: 'Rate must be positive' },
            max: { value: 100, message: 'Rate cannot exceed 100%' },
          })}
        />
      </FormField>
    </Modal>
  )
}

export default function CommissionConfigTab() {
  const { showToast } = useToast()
  const [config, setConfig] = useState(mockCommissionConfig)
  const [editing, setEditing] = useState(null)

  const columns = useMemo(
    () => [
      { header: 'Category', accessorKey: 'category' },
      {
        header: 'Commission Rate',
        accessorKey: 'rate',
        cell: (info) => `${info.getValue()}%`,
      },
      { header: 'Last Updated', accessorKey: 'updatedDate' },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <IconActionButton icon={Pencil} label="Edit rate" variant="edit" onClick={() => setEditing(row.original)} />
        ),
      },
    ],
    []
  )

  const handleSave = (rate) => {
    setConfig((prev) =>
      prev.map((c) =>
        c.id === editing.id ? { ...c, rate, updatedDate: new Date().toISOString().slice(0, 10) } : c
      )
    )
    showToast(`Commission rate for ${editing.category} updated to ${rate}%.`)
    setEditing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Set the platform commission percentage charged per product category.
        </p>
        <ExportCsvButton title="Commission Config"
          data={config}
          filename="commission-config"
          columns={[
            { label: 'Category', accessor: 'category' },
            { label: 'Commission Rate', accessor: (row) => `${row.rate}%` },
            { label: 'Last Updated', accessor: 'updatedDate' },
          ]}
        />
      </div>
      <DataTable columns={columns} data={config} pageSize={10} />
      <EditCommissionModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        item={editing}
      />
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, RefreshCw } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import Toggle from '../../components/common/Toggle'
import { erpSettings } from '../../mock-data/platformConfig'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock data with real API call to /api/v1/platform-config/erp

export default function ErpIntegrationTab() {
  const { showToast } = useToast()
  const [saved, setSaved] = useState(false)
  const [autoSync, setAutoSync] = useState(erpSettings.autoSyncEnabled)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: erpSettings })

  const onSubmit = () => {
    setSaved(true)
    showToast('ERP integration settings saved.')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="ERP Provider" required error={errors.provider?.message}>
          <input className={fieldInputClass} {...register('provider', { required: 'Required' })} />
        </FormField>
        <FormField label="API Base URL" required error={errors.apiBaseUrl?.message}>
          <input
            className={fieldInputClass}
            {...register('apiBaseUrl', {
              required: 'Required',
              pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL' },
            })}
          />
        </FormField>
        <FormField label="Sync Frequency (minutes)" required error={errors.syncFrequencyMinutes?.message}>
          <input
            type="number"
            className={fieldInputClass}
            {...register('syncFrequencyMinutes', { required: 'Required', min: { value: 5, message: 'Minimum 5 minutes' } })}
          />
        </FormField>
      </div>

      <div className="pt-2 border-t border-[var(--color-border)] space-y-3">
        <Toggle checked={autoSync} onChange={setAutoSync} label="Enable automatic sync" />
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <RefreshCw size={13} /> Last synced at {erpSettings.lastSyncedAt}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={!isValid}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={15} /> Save Changes
        </button>
        {saved && <span className="text-sm text-[var(--color-success)]">Settings saved.</span>}
      </div>
    </form>
  )
}

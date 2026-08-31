import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Save, Upload, Trash2 } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import Select from '../../components/common/Select'
import Toggle from '../../components/common/Toggle'
import { usePlatformSettings, LOADER_STYLES } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock data with real API call to /api/v1/platform-config/general

const MAX_LOGO_SIZE_MB = 2

export default function GeneralSettingsTab() {
  const [saved, setSaved] = useState(false)
  const [logoError, setLogoError] = useState('')
  const fileInputRef = useRef(null)
  const { logoDataUrl, setLogo, loaderStyle, setLoaderStyle, generalSettings, setGeneralSettings } =
    usePlatformSettings()
  const { showToast } = useToast()
  const [maintenanceMode, setMaintenanceMode] = useState(generalSettings.maintenanceMode)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: generalSettings })

  const onSubmit = (data) => {
    setGeneralSettings({ ...data, maintenanceMode })
    setSaved(true)
    showToast('General settings saved.')
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoError('')

    if (!file.type.startsWith('image/')) {
      setLogoError('Please upload an image file (PNG, JPG, or SVG).')
      return
    }
    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      setLogoError(`Image must be smaller than ${MAX_LOGO_SIZE_MB}MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLogo(reader.result)
      showToast('Logo uploaded.')
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      {/* Logo upload — used in the sidebar and as the browser tab favicon */}
      <FormField label="Platform Logo" hint="Used in the sidebar and browser tab. PNG, JPG or SVG, up to 2MB.">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center overflow-hidden shrink-0">
            {logoDataUrl ? (
              <img src={logoDataUrl} alt="Current logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-[var(--color-text-muted)]">No logo</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              <Upload size={14} /> Upload Logo
            </button>
            {logoDataUrl && (
              <button
                type="button"
                onClick={() => {
                  setLogo(null)
                  showToast('Logo removed.', 'error')
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
        </div>
        {logoError && <p className="mt-1 text-xs text-[var(--color-danger)]">{logoError}</p>}
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Platform Name" required error={errors.platformName?.message}>
          <input className={fieldInputClass} {...register('platformName', { required: 'Required' })} />
        </FormField>
        <FormField label="Default Currency" required>
          <Controller
            name="defaultCurrency"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'INR', label: 'INR (₹)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                ]}
                className={fieldInputClass}
              />
            )}
          />
        </FormField>
        <FormField label="Support Email" required error={errors.supportEmail?.message}>
          <input
            type="email"
            className={fieldInputClass}
            {...register('supportEmail', {
              required: 'Required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </FormField>
        <FormField label="Support Phone" required error={errors.supportPhone?.message}>
          <input className={fieldInputClass} {...register('supportPhone', { required: 'Required' })} />
        </FormField>
        <FormField label="Timezone" required>
          <Controller
            name="timezone"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'America/New_York (EST)' },
                ]}
                className={fieldInputClass}
              />
            )}
          />
        </FormField>
        <FormField label="Page Loader Style" hint="Shown while a page or route is loading.">
          <Select
            className={fieldInputClass}
            value={loaderStyle}
            onChange={(e) => setLoaderStyle(e.target.value)}
            options={LOADER_STYLES}
          />
        </FormField>
      </div>

      <div className="pt-2 border-t border-[var(--color-border)]">
        <Toggle
          checked={maintenanceMode}
          onChange={setMaintenanceMode}
          label="Enable Maintenance Mode (blocks customer-facing storefront)"
        />
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

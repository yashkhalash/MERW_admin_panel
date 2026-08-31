import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Save } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import Select from '../../components/common/Select'
import Toggle from '../../components/common/Toggle'
import { paymentGatewaySettings } from '../../mock-data/platformConfig'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock data with real API call to /api/v1/platform-config/payment-gateway

export default function PaymentGatewayTab() {
  const { showToast } = useToast()
  const [saved, setSaved] = useState(false)
  const [testMode, setTestMode] = useState(paymentGatewaySettings.testMode)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: paymentGatewaySettings })

  const onSubmit = () => {
    setSaved(true)
    showToast('Payment gateway settings saved.')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Payment Gateway Provider" required>
          <Controller
            name="provider"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} options={['Razorpay', 'PayU', 'Stripe', 'CCAvenue']} className={fieldInputClass} />
            )}
          />
        </FormField>
        <FormField label="Merchant ID" required error={errors.merchantId?.message}>
          <input className={fieldInputClass} {...register('merchantId', { required: 'Required' })} />
        </FormField>
        <FormField label="Webhook URL" required error={errors.webhookUrl?.message}>
          <input
            className={fieldInputClass}
            {...register('webhookUrl', {
              required: 'Required',
              pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL' },
            })}
          />
        </FormField>
        <FormField label="Settlement Cycle" required>
          <Controller
            name="settlementCycle"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Select {...field} options={['T+1', 'T+2', 'T+3']} className={fieldInputClass} />}
          />
        </FormField>
      </div>

      <div className="pt-2 border-t border-[var(--color-border)]">
        <Toggle checked={testMode} onChange={setTestMode} label="Enable test/sandbox mode" />
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

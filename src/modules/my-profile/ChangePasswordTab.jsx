import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { KeyRound } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import PasswordInput from '../../components/common/PasswordInput'
import { useToast } from '../../components/common/ToastContext'

export default function ChangePasswordTab() {
  const { showToast } = useToast()
  const [saved, setSaved] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const newPassword = watch('newPassword')

  const onSubmit = () => {
    // TODO: replace with real API call — POST /api/v1/profile/change-password
    setSaved(true)
    reset()
    showToast('Password updated.')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Current Password" required error={errors.currentPassword?.message}>
          <PasswordInput
            className={fieldInputClass}
            {...register('currentPassword', { required: 'Current password is required' })}
          />
        </FormField>

        <FormField
          label="New Password"
          required
          error={errors.newPassword?.message}
          hint="At least 8 characters, including a number."
        >
          <PasswordInput
            className={fieldInputClass}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' },
              pattern: { value: /\d/, message: 'Must include at least one number' },
            })}
          />
        </FormField>

        <FormField label="Confirm New Password" required error={errors.confirmPassword?.message}>
          <PasswordInput
            className={fieldInputClass}
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (v) => v === newPassword || 'Passwords do not match',
            })}
          />
        </FormField>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <KeyRound size={15} /> Update Password
          </button>
          {saved && <span className="text-sm text-[var(--color-success)]">Password updated.</span>}
        </div>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, CheckCircle2 } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import PasswordInput from '../../components/common/PasswordInput'
import AuthLayout from './AuthLayout'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock flow with real API call to /api/v1/auth/reset-password (validate token server-side)

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const newPassword = watch('newPassword')

  const onSubmit = () => {
    setDone(true)
    showToast('Password reset successfully.')
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid or expired link">
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="block text-center text-sm text-[var(--color-primary-dark)] font-medium hover:underline"
        >
          Request a new reset link
        </Link>
      </AuthLayout>
    )
  }

  if (done) {
    return (
      <AuthLayout title="Password reset">
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center text-[var(--color-success)]">
            <CheckCircle2 size={22} />
          </div>
          <p className="text-sm text-[var(--color-text)]">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 w-full px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            Continue to Sign In
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <KeyRound size={16} /> Reset Password
        </button>
      </form>
    </AuthLayout>
  )
}

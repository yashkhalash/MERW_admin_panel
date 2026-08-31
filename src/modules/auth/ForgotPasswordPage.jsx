import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Send, ArrowLeft, MailCheck } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import AuthLayout from './AuthLayout'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock flow with real API call to /api/v1/auth/forgot-password

export default function ForgotPasswordPage() {
  const { showToast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const onSubmit = () => {
    setSubmitted(true)
    showToast('Password reset link sent.')
  }

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        footer={
          <Link to="/login" className="flex items-center justify-center gap-1.5 text-[var(--color-primary-dark)] font-medium hover:underline">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center text-[var(--color-success)]">
            <MailCheck size={22} />
          </div>
          <p className="text-sm text-[var(--color-text)]">
            If an account exists for <span className="font-medium">{getValues('email')}</span>, a password reset
            link has been sent.
          </p>
          <Link
            to="/reset-password?token=demo"
            className="mt-2 text-sm text-[var(--color-secondary)] hover:underline"
          >
            Continue to reset password (demo link)
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your registered email and we'll send you a reset link"
      footer={
        <Link to="/login" className="flex items-center justify-center gap-1.5 text-[var(--color-primary-dark)] font-medium hover:underline">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" required error={errors.email?.message}>
          <input
            type="email"
            className={fieldInputClass}
            placeholder="admin@merw-marketplace.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </FormField>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} /> Send Reset Link
        </button>
      </form>
    </AuthLayout>
  )
}

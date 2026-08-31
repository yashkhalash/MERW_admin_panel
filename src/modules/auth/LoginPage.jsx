import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import PasswordInput from '../../components/common/PasswordInput'
import AuthLayout from './AuthLayout'
import { useToast } from '../../components/common/ToastContext'
// TODO: replace mock auth with real API call to /api/v1/auth/login

export default function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [authError, setAuthError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const onSubmit = () => {
    // Mock-only: any well-formed email/password combination signs in.
    setAuthError('')
    showToast('Signed in successfully.')
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your admin credentials to continue"
      footer={
        <>
          Forgot your password?{' '}
          <Link to="/forgot-password" className="text-[var(--color-primary-dark)] font-medium hover:underline">
            Reset it here
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" required error={errors.email?.message}>
          <input
            type="email"
            autoComplete="username"
            className={fieldInputClass}
            placeholder="admin@merw-marketplace.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </FormField>

        <FormField label="Password" required error={errors.password?.message}>
          <PasswordInput
            autoComplete="current-password"
            className={fieldInputClass}
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary)]" {...register('rememberMe')} />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-[var(--color-primary-dark)] font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {authError && <p className="text-sm text-[var(--color-danger)]">{authError}</p>}

        <button
          type="submit"
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LogIn size={16} /> Sign In
        </button>
      </form>
    </AuthLayout>
  )
}

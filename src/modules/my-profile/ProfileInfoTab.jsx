import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Save, X, Camera, Trash2, Mail, Phone, Shield, Calendar, Clock } from 'lucide-react'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import { useProfile } from './ProfileContext'
import { useToast } from '../../components/common/ToastContext'

const MAX_AVATAR_SIZE_MB = 2

export default function ProfileInfoTab() {
  const { profile, updateProfile, setAvatar, avatarUrl } = useProfile()
  const { showToast } = useToast()
  const [editing, setEditing] = useState(false)
  const fileInputRef = useRef(null)
  const [avatarError, setAvatarError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: profile })

  useEffect(() => {
    reset(profile)
  }, [profile, reset])

  const onSubmit = (data) => {
    updateProfile(data)
    setEditing(false)
    showToast('Profile updated.')
  }

  const handleCancel = () => {
    reset(profile)
    setEditing(false)
  }

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError('')

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please upload an image file (PNG or JPG).')
      return
    }
    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      setAvatarError(`Image must be smaller than ${MAX_AVATAR_SIZE_MB}MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result)
      showToast('Profile photo updated.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    showToast('Profile photo removed.', 'error')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left: avatar + summary card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-bg)] shadow-sm"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center border-2 border-[var(--color-surface)] hover:opacity-90"
            title="Change photo"
            aria-label="Change photo"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>

        {avatarError && <p className="text-xs text-[var(--color-danger)] mb-2">{avatarError}</p>}

        {profile.avatarUrl && (
          <button
            onClick={handleRemoveAvatar}
            className="flex items-center gap-1 text-xs text-[var(--color-danger)] hover:underline mb-4"
          >
            <Trash2 size={12} /> Remove photo
          </button>
        )}

        <p className="text-base font-semibold text-[var(--color-text)]">{profile.name}</p>
        <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]">
          <Shield size={11} /> {profile.role}
        </span>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{profile.department}</p>

        <dl className="w-full mt-6 pt-5 border-t border-[var(--color-border)] space-y-3 text-left">
          <div className="flex items-center gap-2.5 text-sm">
            <Mail size={14} className="text-[var(--color-text-muted)] shrink-0" />
            <span className="text-[var(--color-text)] truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Phone size={14} className="text-[var(--color-text-muted)] shrink-0" />
            <span className="text-[var(--color-text)]">{profile.mobile}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Calendar size={14} className="text-[var(--color-text-muted)] shrink-0" />
            <span className="text-[var(--color-text)]">Joined {profile.joinedDate}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Clock size={14} className="text-[var(--color-text-muted)] shrink-0" />
            <span className="text-[var(--color-text)]">Last login {profile.lastLogin}</span>
          </div>
        </dl>
      </div>

      {/* Right: editable details form */}
      <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Personal Information</h3>
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              >
                <X size={14} /> Cancel
              </button>
              <button
                type="submit"
                form="profile-info-form"
                disabled={!isValid}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <form id="profile-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required error={errors.name?.message}>
              <input
                disabled={!editing}
                className={`${fieldInputClass} disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-muted)]`}
                {...register('name', { required: 'Name is required' })}
              />
            </FormField>
            <FormField label="Email" required error={errors.email?.message}>
              <input
                type="email"
                disabled={!editing}
                className={`${fieldInputClass} disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-muted)]`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
              />
            </FormField>
            <FormField label="Mobile" required error={errors.mobile?.message}>
              <input
                disabled={!editing}
                className={`${fieldInputClass} disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-muted)]`}
                {...register('mobile', { required: 'Mobile is required' })}
              />
            </FormField>
            <FormField label="Department" required error={errors.department?.message}>
              <input
                disabled={!editing}
                className={`${fieldInputClass} disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-muted)]`}
                {...register('department', { required: 'Department is required' })}
              />
            </FormField>
          </div>

          <FormField label="Role" hint="Role is managed under Role & Permission Management.">
            <input
              disabled
              value={profile.role}
              readOnly
              className={`${fieldInputClass} bg-[var(--color-bg)] text-[var(--color-text-muted)]`}
            />
          </FormField>
        </form>
      </div>
    </div>
  )
}

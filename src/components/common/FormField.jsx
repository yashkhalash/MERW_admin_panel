// Generic labeled form field wrapper for use with react-hook-form registered inputs.
// Usage: <FormField label="Name" error={errors.name?.message} required>
//          <input {...register('name')} className={fieldInputClass} />
//        </FormField>
export const fieldInputClass =
  'w-full text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40'

export default function FormField({ label, error, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
        {label} {required && <span className="text-[var(--color-danger)]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
      {error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}

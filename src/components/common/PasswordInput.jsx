import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { fieldInputClass } from './FormField'

// Password <input> with a show/hide toggle. Drop-in replacement for
// `<input type="password" className={fieldInputClass} {...register(...)} />` —
// forwards its ref so it still works with react-hook-form's register().
const PasswordInput = forwardRef(function PasswordInput({ className = fieldInputClass, ...props }, ref) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input ref={ref} type={visible ? 'text' : 'password'} className={`${className} pr-10`} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-0 top-0 h-full px-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
})

export default PasswordInput

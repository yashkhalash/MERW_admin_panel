import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import { FAQ_CATEGORIES } from '../../mock-data/faqs'

export default function FaqFormModal({ open, onClose, onSave, faq }) {
  const isEdit = !!faq

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { question: '', answer: '', category: FAQ_CATEGORIES[0], status: 'Draft' },
  })

  useEffect(() => {
    if (open) {
      reset(
        faq
          ? { question: faq.question, answer: faq.answer, category: faq.category, status: faq.status }
          : { question: '', answer: '', category: FAQ_CATEGORIES[0], status: 'Draft' }
      )
    }
  }, [open, faq, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit FAQ' : 'Add FAQ'}
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSave)}
            disabled={!isValid}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save Changes' : 'Add FAQ'}
          </button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSave)}>
        <FormField label="Question" required error={errors.question?.message}>
          <input
            className={fieldInputClass}
            placeholder="e.g. How do I track my order?"
            {...register('question', { required: 'Question is required' })}
          />
        </FormField>

        <FormField label="Answer" required error={errors.answer?.message}>
          <textarea
            rows={5}
            className={fieldInputClass}
            placeholder="Write the answer shown to customers..."
            {...register('answer', { required: 'Answer is required' })}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category" required>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Select {...field} options={FAQ_CATEGORIES} className={fieldInputClass} />}
            />
          </FormField>

          <FormField label="Status" required>
            <Controller
              name="status"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Select {...field} options={['Draft', 'Published']} className={fieldInputClass} />}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import FormField, { fieldInputClass } from '../../components/common/FormField'

const VEHICLE_TYPES = ['Bike', 'Bicycle', 'Van']
const ZONES = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone']

export default function CourierFormModal({ open, onClose, onSave, courier }) {
  const isEdit = !!courier

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      employeeId: '',
      mobile: '',
      vehicleType: 'Bike',
      zone: 'North Zone',
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        courier
          ? {
              name: courier.name,
              employeeId: courier.employeeId,
              mobile: courier.mobile,
              vehicleType: courier.vehicleType,
              zone: courier.zone,
            }
          : { name: '', employeeId: '', mobile: '', vehicleType: 'Bike', zone: 'North Zone' }
      )
    }
  }, [open, courier, reset])

  const submit = (data) => {
    onSave(data)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Courier' : 'Add Courier'}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(submit)}
            disabled={!isValid}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save Changes' : 'Add Courier'}
          </button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <FormField label="Full Name" required error={errors.name?.message}>
          <input
            className={fieldInputClass}
            placeholder="e.g. Sanjay Kumar"
            {...register('name', { required: 'Name is required' })}
          />
        </FormField>

        <FormField label="Employee ID" required error={errors.employeeId?.message}>
          <input
            className={fieldInputClass}
            placeholder="e.g. EMP50021"
            {...register('employeeId', { required: 'Employee ID is required' })}
          />
        </FormField>

        <FormField label="Mobile" required error={errors.mobile?.message}>
          <input
            className={fieldInputClass}
            placeholder="e.g. +91 9800000000"
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: { value: /^\+?[0-9\s]{10,15}$/, message: 'Enter a valid mobile number' },
            })}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Vehicle Type" required>
            <Controller
              name="vehicleType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Select {...field} options={VEHICLE_TYPES} className={fieldInputClass} />}
            />
          </FormField>

          <FormField label="Zone" required>
            <Controller
              name="zone"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Select {...field} options={ZONES} className={fieldInputClass} />}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}

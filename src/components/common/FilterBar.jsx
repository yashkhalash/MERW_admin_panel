import Select from './Select'

// Generic filter bar: renders a set of themed dropdowns driven by a config array.
// filters: [{ key, label, options: [{label, value}] }]
// values: { [key]: value }
export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={values[filter.key] ?? ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          placeholder={`${filter.label}: All`}
          options={[{ value: '', label: `${filter.label}: All` }, ...filter.options]}
          className="text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 min-w-[9rem]"
        />
      ))}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import EnquiryViewModal from './EnquiryViewModal'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import DateRangePicker from '../../components/common/DateRangePicker'
import { useToast } from '../../components/common/ToastContext'
import { enquiries as mockEnquiries } from '../../mock-data/enquiries'
// TODO: replace mock data with real API call to /api/v1/enquiries

export default function EnquiryListPage() {
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const [enquiries, setEnquiries] = useState(mockEnquiries)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: searchParams.get('status') || '' })
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [viewing, setViewing] = useState(null)

  const filteredData = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !filters.status || e.status === filters.status
      const matchesStart = !dateRange.start || e.submittedDate >= dateRange.start
      const matchesEnd = !dateRange.end || e.submittedDate <= dateRange.end
      return matchesSearch && matchesStatus && matchesStart && matchesEnd
    })
  }, [enquiries, search, filters, dateRange])

  const handleStatusChange = (id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    showToast(`Enquiry status updated to "${status}".`)
  }

  const columns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Subject', accessorKey: 'subject' },
      { header: 'Email', accessorKey: 'email', enableSorting: false },
      { header: 'Submitted Date', accessorKey: 'submittedDate' },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <IconActionButton icon={Eye} label="View" variant="view" onClick={() => setViewing(row.original)} />
        ),
      },
    ],
    []
  )

  const activeFilters = [
    search && `Search: "${search}"`,
    filters.status && `Status: ${filters.status}`,
    dateRange.start && `From: ${dateRange.start}`,
    dateRange.end && `To: ${dateRange.end}`,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Contact Enquiries Management"
        subtitle="View customer and seller enquiries submitted through the contact form"
        actions={
          <ExportCsvButton
            data={filteredData}
            filename="enquiries"
            title="Contact Enquiries Management"
            filters={activeFilters}
            columns={[
              { label: 'Name', accessor: 'name' },
              { label: 'Subject', accessor: 'subject' },
              { label: 'Email', accessor: 'email' },
              { label: 'Submitted Date', accessor: 'submittedDate' },
              { label: 'Status', accessor: 'status' },
            ]}
          />
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, subject, email..." />
        <FilterBar
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: ['New', 'In Progress', 'Resolved'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
          placeholder="Submitted date range"
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <EnquiryViewModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        onStatusChange={handleStatusChange}
        enquiry={viewing}
      />
    </div>
  )
}

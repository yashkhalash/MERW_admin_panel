// TODO: replace mock data with real API call to /api/v1/roles

export const PERMISSION_MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'customers', label: 'Customer Management' },
  { key: 'sellers', label: 'Seller Management' },
  { key: 'couriers', label: 'Courier Management' },
  { key: 'orders', label: 'Order Management' },
  { key: 'moderation', label: 'Content Moderation' },
  { key: 'financial', label: 'Financial & Settlement' },
  { key: 'reports', label: 'Reports & Analytics' },
  { key: 'platformConfig', label: 'Platform Configuration' },
  { key: 'roles', label: 'Role & Permission' },
  { key: 'cms', label: 'CMS Management' },
  { key: 'faqs', label: 'FAQ Management' },
  { key: 'enquiries', label: 'Contact Enquiries' },
]

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete']

function allPermissions(value) {
  return PERMISSION_MODULES.reduce((acc, m) => {
    acc[m.key] = { view: value, create: value, edit: value, delete: value }
    return acc
  }, {})
}

function fullAccess() {
  return allPermissions(true)
}

function viewOnly() {
  return PERMISSION_MODULES.reduce((acc, m) => {
    acc[m.key] = { view: true, create: false, edit: false, delete: false }
    return acc
  }, {})
}

export const roles = [
  {
    id: 'ROLE-1',
    name: 'Super Admin',
    description: 'Full access to every module and configuration setting.',
    usersCount: 3,
    createdDate: '2025-11-02',
    permissions: fullAccess(),
  },
  {
    id: 'ROLE-2',
    name: 'Operations Manager',
    description: 'Manages day-to-day orders, couriers, and moderation queues.',
    usersCount: 8,
    createdDate: '2025-12-10',
    permissions: {
      ...allPermissions(false),
      dashboard: { view: true, create: false, edit: false, delete: false },
      orders: { view: true, create: true, edit: true, delete: false },
      couriers: { view: true, create: true, edit: true, delete: false },
      moderation: { view: true, create: false, edit: true, delete: false },
      sellers: { view: true, create: false, edit: false, delete: false },
    },
  },
  {
    id: 'ROLE-3',
    name: 'Finance Analyst',
    description: 'Access to financial reports, settlements, and refund approvals.',
    usersCount: 5,
    createdDate: '2026-01-18',
    permissions: {
      ...allPermissions(false),
      dashboard: { view: true, create: false, edit: false, delete: false },
      financial: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
    },
  },
  {
    id: 'ROLE-4',
    name: 'Content Moderator',
    description: 'Reviews and approves seller/product submissions and CMS content.',
    usersCount: 6,
    createdDate: '2026-02-25',
    permissions: {
      ...allPermissions(false),
      dashboard: { view: true, create: false, edit: false, delete: false },
      moderation: { view: true, create: false, edit: true, delete: false },
      cms: { view: true, create: true, edit: true, delete: false },
      faqs: { view: true, create: true, edit: true, delete: false },
    },
  },
  {
    id: 'ROLE-5',
    name: 'Support Agent',
    description: 'Handles customer enquiries and read-only account lookups.',
    usersCount: 12,
    createdDate: '2026-03-14',
    permissions: viewOnly(),
  },
]

export const assignableUsers = [
  { id: 'USR-1', name: 'Ananya Iyer', email: 'ananya.iyer@merw-marketplace.com', currentRole: 'Operations Manager' },
  { id: 'USR-2', name: 'Rohan Verma', email: 'rohan.verma@merw-marketplace.com', currentRole: 'Support Agent' },
  { id: 'USR-3', name: 'Priya Nair', email: 'priya.nair@merw-marketplace.com', currentRole: 'Finance Analyst' },
  { id: 'USR-4', name: 'Karan Malhotra', email: 'karan.malhotra@merw-marketplace.com', currentRole: 'Content Moderator' },
  { id: 'USR-5', name: 'Isha Gupta', email: 'isha.gupta@merw-marketplace.com', currentRole: 'Support Agent' },
  { id: 'USR-6', name: 'Vikram Rao', email: 'vikram.rao@merw-marketplace.com', currentRole: 'Operations Manager' },
]

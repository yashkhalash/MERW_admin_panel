// TODO: replace mock data with real API call to /api/v1/enquiries

const subjects = [
  'Order not delivered yet',
  'Refund not received',
  'Unable to update payment details',
  'Product received damaged',
  'Seller account verification query',
  'Unable to reset password',
  'Bulk order enquiry',
  'Courier delay for my order',
]

const names = [
  'Aarav Sharma', 'Diya Gupta', 'Kabir Verma', 'Ananya Iyer', 'Rohan Reddy',
  'Meera Nair', 'Sahil Patel', 'Simran Kaur', 'Nikhil Rao', 'Pooja Joshi',
]

const statuses = ['New', 'New', 'In Progress', 'Resolved']

export const enquiries = Array.from({ length: 26 }, (_, i) => {
  const name = names[i % names.length]
  const subject = subjects[i % subjects.length]
  return {
    id: `ENQ-${8000 + i}`,
    name,
    email: `${name.split(' ')[0].toLowerCase()}@example.com`,
    mobile: `+91 9${String(500000000 + i * 47).padStart(9, '0')}`,
    subject,
    message: `Hello, I am writing regarding "${subject.toLowerCase()}". Could you please look into this and get back to me at the earliest? Order/reference details are available on my account if needed.`,
    submittedDate: new Date(2026, 7, ((i * 3) % 27) + 1).toISOString().slice(0, 10),
    status: statuses[i % statuses.length],
  }
})

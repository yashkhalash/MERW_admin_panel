// TODO: replace mock data with real API call to /api/v1/customers

const firstNames = [
  'Aarav', 'Vivaan', 'Aditi', 'Diya', 'Kabir', 'Ishaan', 'Ananya', 'Meera',
  'Rohan', 'Sanya', 'Aryan', 'Priya', 'Karan', 'Neha', 'Yash', 'Riya',
  'Arjun', 'Kavya', 'Dev', 'Simran', 'Nikhil', 'Pooja', 'Rahul', 'Tanvi',
  'Sahil', 'Isha', 'Manav', 'Aisha', 'Vikram', 'Nisha',
]
const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Iyer', 'Reddy', 'Nair', 'Patel', 'Singh',
  'Mehta', 'Kapoor', 'Bose', 'Chatterjee', 'Rao', 'Joshi', 'Malhotra',
]

const statuses = ['Active', 'Active', 'Active', 'Suspended']

function pad(n, len = 2) {
  return String(n).padStart(len, '0')
}

export const customers = Array.from({ length: 42 }, (_, i) => {
  const first = firstNames[i % firstNames.length]
  const last = lastNames[(i * 3) % lastNames.length]
  const name = `${first} ${last}`
  const status = statuses[i % statuses.length]
  const registeredDate = new Date(2024, (i * 5) % 12, ((i * 7) % 27) + 1)
  return {
    id: `CUST-${1000 + i}`,
    name,
    mobile: `+91 9${pad(800000000 + i * 37, 9)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    registeredDate: registeredDate.toISOString().slice(0, 10),
    totalOrders: (i * 13) % 65,
    status,
    suspendReason: status === 'Suspended' ? 'Repeated payment disputes flagged by finance team.' : null,
    addresses: [
      {
        label: 'Home',
        line: `${100 + i} MG Road, Sector ${((i % 12) + 1)}`,
        city: ['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad'][i % 5],
        pincode: `4${pad(10000 + i * 3, 5)}`,
      },
    ],
    recentOrders: Array.from({ length: 3 }, (_, j) => ({
      orderId: `ORD-${20000 + i * 3 + j}`,
      date: new Date(2026, 7 - j, ((i + j) % 27) + 1).toISOString().slice(0, 10),
      amount: 500 + ((i + j) * 137) % 4500,
      status: ['Delivered', 'In Transit', 'Processing'][j % 3],
    })),
  }
})

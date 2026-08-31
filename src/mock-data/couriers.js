// TODO: replace mock data with real API call to /api/v1/couriers

const names = [
  'Sanjay Kumar', 'Ramesh Yadav', 'Deepak Singh', 'Ajay Patil', 'Vinod Sharma',
  'Suresh Reddy', 'Manoj Tiwari', 'Anil Kapoor', 'Ravi Nair', 'Sunil Joshi',
  'Prakash Mehra', 'Naveen Gowda', 'Arun Pillai', 'Dinesh Chauhan', 'Vijay Kulkarni',
  'Mahesh Rana', 'Sandeep Bhatt', 'Ashok Menon', 'Rajesh Iyer', 'Gopal Das',
]
const vehicleTypes = ['Bike', 'Bike', 'Van', 'Bicycle', 'Bike']
const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone']
const statuses = ['Active', 'Active', 'Active', 'Suspended']

export const couriers = Array.from({ length: 28 }, (_, i) => {
  const name = names[i % names.length]
  return {
    id: `CRR-${3000 + i}`,
    name,
    employeeId: `EMP${String(5000 + i).padStart(5, '0')}`,
    mobile: `+91 9${String(600000000 + i * 61).padStart(9, '0')}`,
    vehicleType: vehicleTypes[i % vehicleTypes.length],
    zone: zones[i % zones.length],
    status: statuses[i % statuses.length],
    joinedDate: new Date(2023, (i * 3) % 12, ((i * 5) % 27) + 1).toISOString().slice(0, 10),
    deliveriesCompleted: (i * 23) % 900,
    suspendReason:
      statuses[i % statuses.length] === 'Suspended'
        ? 'Multiple late deliveries reported in the last cycle.'
        : null,
  }
})

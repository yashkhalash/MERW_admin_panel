// TODO: replace mock data with real API call to /api/v1/sellers

const storeNames = [
  'Urban Threads', 'TechNest', 'GreenLeaf Grocers', 'Sole Society', 'HomeCraft Co.',
  'Glow Beauty Bar', 'Pixel Gadgets', 'The Book Nook', 'Fit Gear Studio', 'Little Sprouts',
  'Aroma House', 'Bright Toys', 'Metro Furnishings', 'PetPals Supplies', 'Sunrise Bakery',
  'Craftsman Tools', 'Wanderlust Bags', 'Silver Lining Jewels', 'Fresh Fields Farm', 'CozyNest Decor',
]
const owners = [
  'Rahul Mehta', 'Sanya Kapoor', 'Vikram Rao', 'Ananya Iyer', 'Karan Malhotra',
  'Priya Nair', 'Aditya Bose', 'Neha Chatterjee', 'Rohan Verma', 'Isha Gupta',
]
const categories = ['Electronics', 'Fashion', 'Grocery', 'Home & Living', 'Beauty', 'Toys & Kids', 'Books', 'Sports & Fitness']
const verificationStatuses = ['Verified', 'Verified', 'Pending', 'Verified', 'Rejected']

export const sellers = Array.from({ length: 34 }, (_, i) => {
  const storeName = storeNames[i % storeNames.length] + (i >= storeNames.length ? ` ${Math.floor(i / storeNames.length) + 1}` : '')
  const owner = owners[i % owners.length]
  const category = categories[i % categories.length]
  const verificationStatus = verificationStatuses[i % verificationStatuses.length]
  const registeredDate = new Date(2024, (i * 4) % 12, ((i * 9) % 27) + 1)
  const status = verificationStatus === 'Verified' ? (i % 9 === 0 ? 'Suspended' : 'Active') : 'Inactive'

  return {
    id: `SELL-${2000 + i}`,
    storeName,
    owner,
    ownerEmail: `${owner.split(' ')[0].toLowerCase()}@${storeName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    ownerMobile: `+91 9${String(700000000 + i * 53).padStart(9, '0')}`,
    category,
    verificationStatus,
    status,
    registeredDate: registeredDate.toISOString().slice(0, 10),
    products: (i * 17) % 320,
    sales: 25000 + ((i * 4231) % 480000),
    suspendReason: status === 'Suspended' ? 'Multiple customer complaints regarding product quality.' : null,
    rejectReason: verificationStatus === 'Rejected' ? 'Business documents submitted did not match GST registration.' : null,
    documents: [
      { name: 'GST Certificate', status: 'Uploaded' },
      { name: 'PAN Card', status: 'Uploaded' },
      { name: 'Bank Account Proof', status: 'Uploaded' },
    ],
    recentProducts: Array.from({ length: 3 }, (_, j) => ({
      name: `${category} Item ${j + 1}`,
      price: 199 + ((i + j) * 87) % 4800,
      stock: (i + j * 3) % 150,
    })),
  }
})

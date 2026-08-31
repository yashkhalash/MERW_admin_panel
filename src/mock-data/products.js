// TODO: replace mock data with real API call to /api/v1/products/moderation-queue
import { sellers } from './sellers'

const productNames = [
  'Wireless Earbuds Pro', 'Organic Cold-Pressed Oil', 'Leather Messenger Bag', 'Smart LED Desk Lamp',
  'Handwoven Cotton Rug', 'Bluetooth Fitness Tracker', 'Ceramic Dinner Set', 'Kids Building Blocks Set',
  'Anti-Aging Face Serum', 'Stainless Steel Water Bottle', 'Bestseller Fiction Novel', 'Yoga Mat Premium',
  'Wooden Photo Frame Set', 'Wireless Phone Charger', 'Aromatherapy Diffuser', 'Running Shoes Lite',
  'Kids Storybook Bundle', 'Cast Iron Skillet', 'Denim Jacket Classic', 'Portable Bluetooth Speaker',
]
const categories = ['Electronics', 'Fashion', 'Grocery', 'Home & Living', 'Beauty', 'Toys & Kids', 'Books', 'Sports & Fitness']
const statuses = ['Pending', 'Pending', 'Pending', 'Approved', 'Rejected']

export const products = Array.from({ length: 36 }, (_, i) => {
  const seller = sellers[i % sellers.length]
  const name = productNames[i % productNames.length]
  const status = statuses[i % statuses.length]
  const submittedDate = new Date(2026, 7, ((i * 3) % 27) + 1)
  const aiQualityScore = 55 + ((i * 37) % 45)

  return {
    id: `PRD-${4000 + i}`,
    name,
    sellerId: seller.id,
    sellerName: seller.storeName,
    category: categories[i % categories.length],
    submittedDate: submittedDate.toISOString().slice(0, 10),
    aiQualityScore,
    status,
    price: 199 + ((i * 173) % 4500),
    description: `High quality ${name.toLowerCase()} sourced and listed by ${seller.storeName}. Includes standard warranty and marketplace return policy.`,
    images: 3 + (i % 3),
    rejectReason: status === 'Rejected' ? 'Product images do not match the listed description; possible policy violation.' : null,
    aiFlags:
      aiQualityScore < 70
        ? ['Low-resolution product images', 'Description length below recommended minimum']
        : [],
  }
})

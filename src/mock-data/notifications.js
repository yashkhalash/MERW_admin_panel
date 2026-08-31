// TODO: replace mock data with real API call to /api/v1/notifications

export const notifications = [
  {
    id: 'NTF-1',
    title: 'New seller pending approval',
    message: '"Urban Threads" has submitted verification documents and is awaiting approval.',
    time: '12 min ago',
    read: false,
  },
  {
    id: 'NTF-2',
    title: 'Order flagged for reassignment',
    message: 'Order #ORD-18420 needs manual courier reassignment due to zone congestion.',
    time: '34 min ago',
    read: false,
  },
  {
    id: 'NTF-3',
    title: 'New contact enquiry',
    message: 'A customer submitted an enquiry regarding a refund request.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'NTF-4',
    title: 'Product submitted for moderation',
    message: '"Wireless Earbuds Pro" was submitted by TechNest and is pending review.',
    time: '2 hr ago',
    read: true,
  },
  {
    id: 'NTF-5',
    title: 'Settlement batch processed',
    message: 'Settlement batch #STL-0932 was processed successfully.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 'NTF-6',
    title: 'Refund request submitted',
    message: 'A refund request for order #ORD-20014 is awaiting review.',
    time: '5 hr ago',
    read: true,
  },
]

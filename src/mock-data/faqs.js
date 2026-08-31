// TODO: replace mock data with real API call to /api/v1/faqs

export const FAQ_CATEGORIES = ['General', 'Orders & Shipping', 'Payments & Refunds', 'Selling on MERW', 'Account & Security']

export const faqs = [
  {
    id: 'FAQ-1',
    question: 'How do I track my order?',
    answer:
      'You can track your order from the "My Orders" section of your account. Once shipped, a tracking link is also sent to your registered email and mobile number.',
    category: 'Orders & Shipping',
    status: 'Published',
    updatedDate: '2026-07-18',
  },
  {
    id: 'FAQ-2',
    question: 'What payment methods are accepted?',
    answer:
      'MERW accepts credit/debit cards, UPI, net banking, and popular wallets. All transactions are processed securely through our payment gateway partner.',
    category: 'Payments & Refunds',
    status: 'Published',
    updatedDate: '2026-06-22',
  },
  {
    id: 'FAQ-3',
    question: 'How long does a refund take to process?',
    answer:
      'Approved refunds are typically credited back to the original payment method within 5-7 business days, depending on your bank.',
    category: 'Payments & Refunds',
    status: 'Published',
    updatedDate: '2026-07-01',
  },
  {
    id: 'FAQ-4',
    question: 'How do I become a seller on MERW?',
    answer:
      'Register through the Seller Management portal with your business and GST details. Our team verifies documents within 2-3 business days before activating your storefront.',
    category: 'Selling on MERW',
    status: 'Published',
    updatedDate: '2026-05-14',
  },
  {
    id: 'FAQ-5',
    question: 'Can I change my registered email address?',
    answer:
      'Yes, go to My Profile > Edit Profile to update your registered email. A verification link will be sent to confirm the change.',
    category: 'Account & Security',
    status: 'Draft',
    updatedDate: '2026-08-05',
  },
  {
    id: 'FAQ-6',
    question: 'What is MERW\'s return policy?',
    answer:
      'Most products are eligible for return within 7 days of delivery, provided they are unused and in original packaging. Certain categories may have different policies as noted on the product page.',
    category: 'Orders & Shipping',
    status: 'Published',
    updatedDate: '2026-07-28',
  },
  {
    id: 'FAQ-7',
    question: 'Is my personal data safe with MERW?',
    answer:
      'Yes, MERW follows industry-standard encryption and data protection practices. Please review our Privacy Policy for full details.',
    category: 'General',
    status: 'Draft',
    updatedDate: '2026-08-20',
  },
]

// TODO: replace mock data with real API call to /api/v1/platform-config

export const generalSettings = {
  platformName: 'MERW Multi-Vendor Marketplace',
  supportEmail: 'support@merw-marketplace.com',
  supportPhone: '+91 1800 123 4567',
  defaultCurrency: 'INR',
  timezone: 'Asia/Kolkata',
  maintenanceMode: false,
}

export const erpSettings = {
  provider: 'SAP Business One',
  apiBaseUrl: 'https://erp.merw-marketplace.internal/api/v1',
  syncFrequencyMinutes: 30,
  autoSyncEnabled: true,
  lastSyncedAt: '2026-08-31 06:00',
}

export const paymentGatewaySettings = {
  provider: 'Razorpay',
  merchantId: 'MERW_MID_88213',
  webhookUrl: 'https://api.merw-marketplace.com/webhooks/payments',
  settlementCycle: 'T+2',
  testMode: false,
}

import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AppShellLayout from '../layouts/AppShellLayout'
import LoginPage from '../modules/auth/LoginPage'
import ForgotPasswordPage from '../modules/auth/ForgotPasswordPage'
import ResetPasswordPage from '../modules/auth/ResetPasswordPage'
import DashboardPage from '../modules/dashboard/DashboardPage'
import CustomerListPage from '../modules/customer-management/CustomerListPage'
import CustomerDetailPage from '../modules/customer-management/CustomerDetailPage'
import SellerListPage from '../modules/seller-management/SellerListPage'
import SellerDetailPage from '../modules/seller-management/SellerDetailPage'
import CourierListPage from '../modules/courier-management/CourierListPage'
import CourierDetailPage from '../modules/courier-management/CourierDetailPage'
import OrderListPage from '../modules/order-management/OrderListPage'
import OrderDetailPage from '../modules/order-management/OrderDetailPage'
import ModerationQueuePage from '../modules/content-moderation/ModerationQueuePage'
import ModerationDetailPage from '../modules/content-moderation/ModerationDetailPage'
import FinancialSettlementPage from '../modules/financial-settlement/FinancialSettlementPage'
import ReportsAnalyticsPage from '../modules/reports-analytics/ReportsAnalyticsPage'
import PlatformConfigurationPage from '../modules/platform-configuration/PlatformConfigurationPage'
import RoleListPage from '../modules/role-permission-management/RoleListPage'
import CmsListPage from '../modules/cms-management/CmsListPage'
import CmsDetailPage from '../modules/cms-management/CmsDetailPage'
import CmsPageEditPage from '../modules/cms-management/CmsPageEditPage'
import { CmsPagesProvider } from '../modules/cms-management/CmsPagesContext'
import FaqListPage from '../modules/faq-management/FaqListPage'
import FaqDetailPage from '../modules/faq-management/FaqDetailPage'
import { FaqsProvider } from '../modules/faq-management/FaqsContext'
import EnquiryListPage from '../modules/contact-enquiries-management/EnquiryListPage'
import ProfilePage from '../modules/my-profile/ProfilePage'
import SettingsPage from '../modules/settings/SettingsPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages render full-screen, without the sidebar/topbar shell */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Every admin page shares the sidebar + topbar shell */}
      <Route element={<AppShellLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/sellers" element={<SellerListPage />} />
        <Route path="/sellers/:id" element={<SellerDetailPage />} />
        <Route path="/couriers" element={<CourierListPage />} />
        <Route path="/couriers/:id" element={<CourierDetailPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/moderation" element={<ModerationQueuePage />} />
        <Route path="/moderation/:id" element={<ModerationDetailPage />} />
        <Route path="/financial" element={<FinancialSettlementPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/platform-config" element={<PlatformConfigurationPage />} />
        <Route path="/roles" element={<RoleListPage />} />
        <Route
          path="/cms"
          element={
            <CmsPagesProvider>
              <Outlet />
            </CmsPagesProvider>
          }
        >
          <Route index element={<CmsListPage />} />
          <Route path="new" element={<CmsPageEditPage />} />
          <Route path=":id" element={<CmsDetailPage />} />
          <Route path=":id/edit" element={<CmsPageEditPage />} />
        </Route>
        <Route
          path="/faqs"
          element={
            <FaqsProvider>
              <Outlet />
            </FaqsProvider>
          }
        >
          <Route index element={<FaqListPage />} />
          <Route path=":id" element={<FaqDetailPage />} />
        </Route>
        <Route path="/enquiries" element={<EnquiryListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Placeholder fallback until later modules are built */}
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}

function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <p className="text-lg font-medium text-[var(--color-text)]">Module coming soon</p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">
        This module hasn't been built yet in the sequence.
      </p>
    </div>
  )
}

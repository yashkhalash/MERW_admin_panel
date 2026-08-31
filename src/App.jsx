import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeContext'
import { PlatformSettingsProvider } from './theme/PlatformSettingsContext'
import { ProfileProvider } from './modules/my-profile/ProfileContext'
import { ToastProvider } from './components/common/ToastContext'
import PageLoader from './components/common/PageLoader'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <ThemeProvider>
      <PlatformSettingsProvider>
        <ProfileProvider>
          <ToastProvider>
            <BrowserRouter>
              <PageLoader />
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </ProfileProvider>
      </PlatformSettingsProvider>
    </ThemeProvider>
  )
}

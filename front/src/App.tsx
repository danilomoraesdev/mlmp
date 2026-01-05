import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PrivateLayout } from '@/layouts/PrivateLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PRIVATE_ROUTES } from '@/config/routes.config'

import { Toaster } from 'sonner'

import { LoginForm } from './components/auth/login-form'
import { SignupForm } from './components/auth/signup-form'
import { OTPForm } from './components/auth/otp-form'
import { ForgotPasswordForm } from './components/auth/forgot-password-form'
import { ResetPasswordForm } from './components/auth/reset-password-form'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/cadastro" element={<SignupForm />} />
                <Route path="/otp" element={<OTPForm />} />
                <Route
                  path="/esqueci-minha-senha"
                  element={<ForgotPasswordForm />}
                />
                <Route
                  path="/redefinir-senha"
                  element={<ResetPasswordForm />}
                />
              </Route>

              {/* Private Routes - generated from config */}
              <Route
                element={
                  <ProtectedRoute>
                    <PrivateLayout />
                  </ProtectedRoute>
                }
              >
                {PRIVATE_ROUTES.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component />}
                  />
                ))}
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

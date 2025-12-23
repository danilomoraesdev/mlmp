import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PrivateLayout } from "@/layouts/PrivateLayout"
import { PRIVATE_ROUTES } from "@/config/routes.config"

import { Toaster } from "sonner"

import { LoginPage } from "./pages/Login"
import SignupPage from "./pages/Signup"
import OTPPage from "./pages/OTP"

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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<SignupPage />} />
              <Route path="/otp" element={<OTPPage />} />

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

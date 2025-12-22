import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PrivateLayout } from "@/layouts/PrivateLayout"

import { Toaster } from "sonner"

import { DashboardPage } from "./pages/Dashboard"
import { LoginPage } from "./pages/Login"
import SignupPage from "./pages/Signup"
import OTPPage from "./pages/OTP"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<SignupPage />} />
            <Route path="/otp" element={<OTPPage />} />

            {/* Private Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <PrivateLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              {/* Add more private routes here */}
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

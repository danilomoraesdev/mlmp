import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"

import { Toaster } from "sonner"

import { DashboardPage } from "./pages/Dashboard"
import { LoginPage } from "./pages/Login"
import SignupPage from "./pages/Signup"
import OTPPage from "./pages/OTP"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route path="/otp" element={<OTPPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    </BrowserRouter>
  )
}

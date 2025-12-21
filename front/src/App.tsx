import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"

import { HomePage } from "./pages/HomePage"

import { Toaster } from "sonner"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    </BrowserRouter>
  )
}

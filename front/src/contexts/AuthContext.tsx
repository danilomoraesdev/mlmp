import { createContext, useContext, useState, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "mlmp_auth_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage synchronously
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    return null
  })
  const [isLoading] = useState(false)

  const login = async (email: string, _password: string) => {
    // TODO: Replace with actual API call
    // Simulating API call
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
    }

    setUser(mockUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
